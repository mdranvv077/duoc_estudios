use std::{io::{self, Write}, thread, time::Duration};

const WIDTH: usize = 80;
const HEIGHT: usize = 22;
const SHADES: &[u8] = b".,-~:;=!*#$@";

fn main() -> io::Result<()> {
    let stdout_handle = io::stdout();
    let mut stdout = io::BufWriter::new(stdout_handle.lock());
    let (mut a, mut b) = (0.0_f32, 0.0_f32);

    loop {
        let mut pixels = vec![b' '; WIDTH * HEIGHT];
        let mut depth = vec![0.0_f32; WIDTH * HEIGHT];
        let (sin_a, cos_a) = a.sin_cos();
        let (sin_b, cos_b) = b.sin_cos();

        let mut theta = 0.0_f32;
        while theta < std::f32::consts::TAU {
            let (sin_t, cos_t) = theta.sin_cos();
            let mut phi = 0.0_f32;
            while phi < std::f32::consts::TAU {
                let (sin_p, cos_p) = phi.sin_cos();
                let ring = 2.0 + cos_t;

                let x = ring * cos_p;
                let y = ring * sin_p;
                let z = sin_t;

                let rotated_x = x * cos_b + z * sin_b;
                let rotated_y = y * cos_a - z * sin_a;
                let rotated_z =
                    -x * sin_b + y * sin_a * cos_b + z * cos_a * cos_b;

                let distance = 5.0 + rotated_z;
                let screen_x = (WIDTH as f32 / 2.0 + 20.0 * rotated_x / distance) as isize;
                let screen_y = (HEIGHT as f32 / 2.0 - 10.0 * rotated_y / distance) as isize;

                if screen_x >= 0
                    && screen_x < WIDTH as isize
                    && screen_y >= 0
                    && screen_y < HEIGHT as isize
                {
                    let index = screen_x as usize + WIDTH * screen_y as usize;
                    if 1.0 / distance > depth[index] {
                        depth[index] = 1.0 / distance;

                        let normal_x = cos_t * cos_p * cos_b + sin_t * sin_b;
                        let normal_y = cos_t * sin_p * cos_a - sin_t * sin_a;
                        let normal_z = -cos_t * cos_p * sin_b
                            + cos_t * sin_p * sin_a * cos_b
                            + sin_t * cos_a * cos_b;
                        let light = (normal_x * -0.4 + normal_y * 0.7 + normal_z * -0.6)
                            .max(0.0)
                            .min(1.0);
                        let shade = (light * (SHADES.len() - 1) as f32) as usize;
                        pixels[index] = SHADES[shade];
                    }
                }

                phi += 0.025;
            }
            theta += 0.07;
        }

        write!(stdout, "\x1b[2J\x1b[H")?;
        writeln!(stdout, "  DONUT 3D  |  Rust puro, sin dependencias  |  Ctrl+C para salir")?;
        for row in pixels.chunks(WIDTH) {
            stdout.write_all(row)?;
            stdout.write_all(b"\n")?;
        }
        stdout.flush()?;

        a += 0.04;
        b += 0.02;
        thread::sleep(Duration::from_millis(30));
    }
}