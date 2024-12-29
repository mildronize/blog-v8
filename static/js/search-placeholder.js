var a=Object.defineProperty;var l=(e,o,r)=>o in e?a(e,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[o]=r;var c=(e,o,r)=>l(e,typeof o!="symbol"?o+"":o,r);import"./modulepreload-polyfill.js";import{s as n}from"./search-placeholder2.js";function s(){const e=document.querySelector("#search-placeholder-root");if(e.innerHTML){console.log("SearchPlaceholder: Placeholder already loaded");return}e.innerHTML=`
  <div id="placeholder-search-box-wrapper">
    <input
      id="placeholder-search-box"
      type="text"
      class="search-box"
      placeholder="Search post..."
    />
    <div class="search-modal-loading">Loading Search Modal Component... </div>
    </div>
`}const d=e=>new Promise(o=>setTimeout(o,e));function i(){s();const e=document.querySelector("#placeholder-search-box");if(!e){console.error("SearchPlaceholder: Search box not found");return}e.addEventListener("click",async()=>{e.blur();const o="open";console.log(`SeachPlaceholder: ${o} search modal`),u();const r=new h(".search-modal-loading");r.show(),await m("#search-root"),r.hide(),n.dispatch({action:o})})}class h{constructor(o){c(this,"element");this.element=document.querySelector(o)}show(){this.element.classList.add("show")}hide(){this.element.classList.remove("show")}}async function m(e,o=5e3){var t;const r=Date.now();for(;!((t=document.querySelector(e))!=null&&t.innerHTML);){if(Date.now()-r>o)throw new Error(`Element with selector ${e} not found or not loaded`);await d(100)}}function u(){document.querySelector('script[src="/js/search.js"]')||document.body.appendChild(Object.assign(document.createElement("script"),{type:"module",src:"/js/search.js"}))}i();
