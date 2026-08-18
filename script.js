// A&D Custom Arrows — Full Builder
// Replace the example material costs with your real dealer costs.
// Replace GOOGLE_FORM_URL with your live Google Form URL.

const PRICING = {
  shaft:{fmj5:170,fmj4:165,axis:145,victory:155,blackeagle:150},
  labor:{standard:35,premium:50,elite:75},
  fletching:{premium:15,four:15},
  insert:{brass50:15,brass75:20,brass100:25},
  nock:{premium:10},
  service:{weightMatch:20,spineMatch:25,wraps:15,broadhead:20},
  setup:{tuning:50,rush:25},
  overhead:15
};
const SHAFT_NAMES={fmj5:"Easton FMJ 5mm",fmj4:"Easton FMJ 4mm",axis:"Easton Axis",victory:"Victory RIP TKO",blackeagle:"Black Eagle Rampage"};
const TIER_NAMES={standard:"Standard",premium:"Premium",elite:"Elite"};
const GOOGLE_FORM_URL="PASTE-YOUR-GOOGLE-FORM-URL-HERE";

const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
let quoteBuild=null;

function selected(name){return document.querySelector(`input[name="${name}"]:checked`).value}

function calc(){
  const qty=+$("quantity").value, dozens=qty/12;
  const shaft=selected("shaft"), tier=selected("tier");
  let materials=PRICING.shaft[shaft]*dozens;
  let labor=PRICING.labor[tier]*dozens;
  let components=0, services=0;

  const ins=$("insert").value;
  if(PRICING.insert[ins]) components+=PRICING.insert[ins]*dozens;
  if($("nock").value==="premium") components+=PRICING.nock.premium*dozens;

  if($("fletching").value==="premium") services+=PRICING.fletching.premium*dozens;
  if($("fletching").value==="four") services+=PRICING.fletching.four*dozens;
  ["weightMatch","spineMatch","wraps","broadhead"].forEach(id=>{if($(id).checked)services+=PRICING.service[id]*dozens});
  if($("tuning").checked)services+=PRICING.setup.tuning;
  if($("rush").checked)services+=PRICING.setup.rush;

  const total=materials+labor+components+services+PRICING.overhead;
  const color=$("vaneColor").value;
  const tierName=TIER_NAMES[tier];
  const details=`${qty} arrows • ${$("fletching").value==="four"?"4-fletch":$("fletching").value==="premium"?"3-fletch premium":"3-fletch"} • ${color}`;

  $("materials").textContent=money(materials);
  $("labor").textContent=money(labor);
  $("components").textContent=money(components);
  $("services").textContent=money(services);
  $("total").textContent=money(total);
  $("perArrow").textContent=`${money(total/qty)} / arrow`;
  $("buildName").textContent=`${SHAFT_NAMES[shaft]} • ${tierName}`;
  $("buildDetails").textContent=details;

  const dw=$("drawWeight").value, dl=$("drawLength").value, spine=$("spine").value;
  $("recommendation").textContent=dw&&dl
    ? `A&D will verify the ${dw} lb / ${dl}" setup, selected ${spine==="unknown"?"spine recommendation":spine+" spine"}, finished length, and component weight before final approval.`
    : "Enter your draw weight and draw length for a more useful build review.";

  const filled=[shaft,$("spine").value,$("length").value,tier,$("fletching").value,$("insert").value,$("nock").value,$("drawWeight").value,$("drawLength").value].filter(Boolean).length;
  $("progressBar").style.width=Math.min(100,14+filled*9)+"%";

  return {qty,shaft,tier,spine:$("spine").value,length:$("length").value,fletching:$("fletching").value,vaneColor:$("vaneColor").value,insert:ins,nock:$("nock").value,total,materials,labor,components,services};
}

function addToQuote(){
  quoteBuild=calc();
  const b=quoteBuild;
  $("quoteItems").innerHTML=`<div class="quote-item"><b>${SHAFT_NAMES[b.shaft]} • ${TIER_NAMES[b.tier]}</b><span>${b.qty} arrows • ${b.spine} spine • ${b.length||"length to confirm"}" • ${b.fletching} • ${b.vaneColor}</span></div>
  <div class="quote-item"><b>Components & Services</b><span>${b.insert} • ${b.nock} • Estimated services/upgrades: ${money(b.services)}</span></div>`;
  $("quoteTotal").textContent=money(b.total);
  document.querySelector("#quote").scrollIntoView({behavior:"smooth"});
}

document.querySelectorAll("input,select").forEach(el=>{
  el.addEventListener("input",calc); el.addEventListener("change",calc);
});
document.querySelectorAll(".product-option").forEach(label=>{
  label.addEventListener("click",()=>setTimeout(calc,0));
});
document.querySelectorAll(".swatch").forEach(btn=>{
  btn.addEventListener("click",()=>{
    $("vaneColor").value=btn.dataset.color;
    document.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active"); calc();
  });
});

$("addQuote").addEventListener("click",addToQuote);
$("submitQuote").addEventListener("click",()=>{
  if(!quoteBuild){alert("Build your arrows and click “Add Build to Quote” first.");return}
  if(!GOOGLE_FORM_URL.startsWith("http")){alert("Add your Google Form URL in script.js first.");return}
  window.open(GOOGLE_FORM_URL,"_blank","noopener");
});
calc();
