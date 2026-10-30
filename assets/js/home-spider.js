(() => {
  const runner = document.querySelector('.home-header-spider__runner');
  if (!runner || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const body = runner.querySelector('.home-header-spider__body');
  const specs = [
    // Phase, support time, lift and segment lengths give each leg its own step.
    ['a', 21, 14, 3, 0, .68, 5.2, 16, 17],
    ['b', 22, 16, 13, .5, .72, 4.1, 14, 15],
    ['c', 25, 15, 30, .25, .67, 5.8, 15, 16],
    ['d', 26, 16, 39, .75, .65, 6.2, 16, 17],
    ['rear-a', 21, 14, 6, .625, .69, 4.6, 15, 17],
    ['rear-b', 22, 16, 16, .125, .71, 3.8, 14, 15],
    ['rear-c', 25, 15, 28, .875, .70, 4.8, 15, 16],
    ['rear-d', 26, 16, 36, .375, .66, 5.6, 16, 16],
  ];
  const legs = specs.map(([name, x, y, foot, phase, stance, lift, upper, lower]) => ({
    node: runner.querySelector(`.spider-leg--${name}`), x, y, foot, phase,
    stance, lift, upper, lower,
  }));
  const cycle = .84;
  // While planted, the foot moves back relative to the moving body so that
  // it stays on the same point of the header. The return stroke lifts it.
  const warmup = .6;
  const travelPerCycle = (180 / (7.28 - warmup / 2)) * cycle / (38 / 40);
  function pose(leg, footX, footY) {
    const dx = footX - leg.x, dy = footY - leg.y;
    const distance = Math.max(.1, Math.hypot(dx, dy));
    const { upper, lower } = leg;
    const along = (upper * upper - lower * lower + distance * distance) / (2 * distance);
    const bend = Math.sqrt(Math.max(0, upper * upper - along * along));
    const sign = dx < 0 ? 1 : -1;
    const kneeX = leg.x + dx * along / distance - sign * dy * bend / distance;
    const kneeY = leg.y + dy * along / distance + sign * dx * bend / distance;
    leg.node.setAttribute('d', `M${leg.x} ${leg.y}L${kneeX.toFixed(2)} ${kneeY.toFixed(2)}L${footX.toFixed(2)} ${footY.toFixed(2)}`);
  }
  legs.forEach(leg => pose(leg, leg.foot, 28));
  function frame() {
    const animation = runner.getAnimations()[0];
    const elapsed = Number(animation?.currentTime || 0);
    if (elapsed >= 5440 && elapsed < 6280) {
      // Compensate for the body's compression so the feet stay on the line.
      // Changing the foot-to-hip distance bends the knee through pose().
      const translation = getComputedStyle(body).translate.split(/\s+/);
      const drop = parseFloat(translation[1]) || 0;
      const svgScale = body.getBoundingClientRect().width / 40;
      legs.forEach(leg => pose(leg, leg.foot, 28 - drop / svgScale));
    }
    if (elapsed >= 6280 && elapsed < 13560) {
      const seconds = (elapsed - 6280) / 1000;
      // Gradually introduce the gait and its cadence from the resting pose.
      const ramp = Math.min(1, seconds / warmup);
      const weight = ramp * ramp * (3 - 2 * ramp);
      const gaitTime = seconds < warmup
        ? seconds * seconds / (2 * warmup) : seconds - warmup / 2;
      for (const leg of legs) {
        const phase = (gaitTime / cycle + leg.phase) % 1;
        const { stance } = leg;
        const stride = travelPerCycle * stance;
        let offset, lift = 0;
        if (phase < stance) {
          offset = stride * (.5 - phase / stance);
        } else {
          const swing = (phase - stance) / (1 - stance);
          const eased = swing * swing * (3 - 2 * swing);
          offset = stride * (eased - .5);
          lift = leg.lift * Math.sin(Math.PI * swing);
        }
        pose(leg, leg.foot + offset * weight, 28 - lift * weight);
      }
    }
    if (elapsed < 13560) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
