(() => {
  const form=document.getElementById("vlsm-form"); if(!form)return;
  const list=document.getElementById("request-list"),addButton=document.getElementById("add-request"),status=document.getElementById("vlsm-status"),results=document.getElementById("vlsm-results"),resultsBody=document.getElementById("results-body"),resultsSummary=document.getElementById("results-summary");
  const help=document.getElementById("vlsm-help"),openHelp=document.querySelector("[data-open-vlsm-help]"),closeHelp=document.querySelector("[data-close-vlsm-help]");
  const ipToNumber=ip=>ip.split(".").reduce((total,part)=>total*256+Number(part),0)>>>0;
  const numberToIp=number=>[24,16,8,0].map(shift=>(number>>>shift)&255).join(".");
  const prefixMask=prefix=>prefix===0?0:(0xffffffff<<(32-prefix))>>>0;
  const validIp=ip=>/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)&&ip.split(".").every(part=>Number(part)<=255);
  const nextPowerOfTwo=value=>2**Math.ceil(Math.log2(value));
  function createRequest(name="Nueva subred",hosts="10"){const row=document.createElement("div");row.className="request-row";row.innerHTML=`<label>Nombre<input class="request-name" value="${name}" maxlength="32" /></label><label>Hosts necesarios<input class="request-hosts" type="number" inputmode="numeric" value="${hosts}" min="1" max="16777214" /></label><button class="remove-request" type="button" aria-label="Quitar subred">×</button>`;list.append(row)}
  function setStatus(message,error=false){status.textContent=message;status.classList.toggle("is-error",error)}
  function showError(message){results.hidden=true;setStatus(message,true)}
  addButton.addEventListener("click",()=>createRequest());
  if(help&&openHelp&&closeHelp){openHelp.addEventListener("click",()=>help.showModal());closeHelp.addEventListener("click",()=>help.close());help.addEventListener("click",event=>{if(event.target===help)help.close()});if(new URLSearchParams(window.location.search).get("guia")==="1")help.showModal()}
  list.addEventListener("click",event=>{const button=event.target.closest(".remove-request");if(button&&list.children.length>1)button.closest(".request-row").remove()});
  function invalidateResults() {
    results.hidden = true;
    setStatus("");
  }
  form.addEventListener("input", invalidateResults);
  list.addEventListener("click", event => {
    if (event.target.closest(".remove-request")) invalidateResults();
  });
  addButton.addEventListener("click", invalidateResults);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const cidr = document.getElementById("base-network").value.trim().split("/");
    const [rawIp, rawPrefix] = cidr;
    const prefix = Number(rawPrefix);
    if (cidr.length !== 2 || !validIp(rawIp) || !/^\d{1,2}$/.test(rawPrefix) || prefix > 30) {
      showError("Usa una red IPv4 válida, por ejemplo 192.168.10.0/24.");
      return;
    }
    const start = ipToNumber(rawIp);
    const network = (start & prefixMask(prefix)) >>> 0;
    const end = network + 2 ** (32 - prefix);
    const requests = [...list.querySelectorAll(".request-row")].map((row, index) => ({
      name: row.querySelector(".request-name").value.trim() || `Subred ${index + 1}`,
      hosts: Number(row.querySelector(".request-hosts").value)
    }));
    if (requests.some(({hosts}) => !Number.isInteger(hosts) || hosts < 1 || hosts > 16777214)) {
      showError("Introduce entre 1 y 16777214 hosts por subred.");
      return;
    }
    const planned = requests.map(request => ({...request, size: nextPowerOfTwo(request.hosts + 2)}))
      .sort((a, b) => b.hosts - a.hosts);
    const required = planned.reduce((total, request) => total + request.size, 0);
    // Smaller power-of-two blocks remain aligned after the largest block.
    let cursor = Math.ceil(start / planned[0].size) * planned[0].size;
    if (cursor + required > end) {
      const available = Math.max(0, end - cursor);
      showError(`Desde ${rawIp}, tras alinear la primera subred, quedan ${available} direcciones hasta ${numberToIp(end - 1)}. Las subredes requieren ${required}.`);
      return;
    }
    const allocations = planned.map(request => {
      const first = cursor;
      cursor += request.size;
      return {...request, network: first, prefix: 32 - Math.log2(request.size), broadcast: cursor - 1};
    });
    resultsBody.innerHTML=allocations.map(item=>{const usableHosts=item.size-2;return `<tr><td>${item.name}</td><td>${item.hosts} <small>/ ${usableHosts}</small></td><td>${numberToIp(item.network)}/${item.prefix}</td><td>${numberToIp(prefixMask(item.prefix))}</td><td>${numberToIp(item.network+1)} — ${numberToIp(item.broadcast-1)}</td><td>${numberToIp(item.broadcast)}</td></tr>`}).join("");resultsSummary.textContent = `Inicio solicitado: ${rawIp}. Primera subred: ${numberToIp(allocations[0].network)}/${allocations[0].prefix}. Después de la última asignación quedan ${end - cursor} direcciones en ${numberToIp(network)}/${prefix}.`;results.hidden=false;setStatus("Cálculo actualizado");results.scrollIntoView({behavior:"smooth",block:"start"})});
})();
