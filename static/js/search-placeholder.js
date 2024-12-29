var l=Object.defineProperty;var s=(e,o,t)=>o in e?l(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var c=(e,o,t)=>s(e,typeof o!="symbol"?o+"":o,t);import"./modulepreload-polyfill.js";import{s as a}from"./search-placeholder2.js";async function i(e,o=5e3){var n;const t=Date.now();for(;!((n=document.querySelector(e))!=null&&n.innerHTML);){if(Date.now()-t>o)throw new Error(`Element with selector ${e} not found or not loaded`);await u(100)}}function d(e){const o=document.querySelector(e);if(!o)throw new Error(`Element not found: ${e}`);return o}function h(e,o="module"){document.querySelector(`script[src="${e}"]`)||document.body.appendChild(Object.assign(document.createElement("script"),{type:o,src:e}))}function m(e){const o=document.querySelector(e);if(o.innerHTML){console.log("SearchPlaceholder: Placeholder already loaded");return}o.innerHTML=`
  <div id="placeholder-search-box-wrapper">
    <input
      id="placeholder-search-box"
      type="text"
      class="search-box"
      placeholder="Search post..."
    />
    <div class="search-modal-loading">Loading Search Modal Component... </div>
  </div>
`}const u=e=>new Promise(o=>setTimeout(o,e));class p{constructor(o){c(this,"element");this.element=document.querySelector(o)}show(){this.element.classList.add("show")}hide(){this.element.classList.remove("show")}}function w(){m("#search-placeholder-root");const e=d("#placeholder-search-box");S(e),e.addEventListener("click",()=>r(e))}async function r(e){e.blur();const o="open";console.log("SearchPlaceholder: Injecting Script for Search Modal Component (React)"),h("/js/search.js");const t=new p(".search-modal-loading");t.show(),await i("#search-root"),console.log("SearchPlaceholder: Loaded Search Modal Component (React)"),t.hide(),console.log(`SearchPlaceholder: Emitting "${a.name}" event, action: "${o}"`),a.dispatch({action:o})}function S(e){new URLSearchParams(window.location.search).get("q")!==null&&r(e)}w();
