var c=Object.defineProperty;var l=(e,o,t)=>o in e?c(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var r=(e,o,t)=>l(e,typeof o!="symbol"?o+"":o,t);import"./modulepreload-polyfill.js";import{s}from"./search-placeholder2.js";async function i(e,o=5e3){var n;const t=Date.now();for(;!((n=document.querySelector(e))!=null&&n.innerHTML);){if(Date.now()-t>o)throw new Error(`Element with selector ${e} not found or not loaded`);await u(100)}}function d(e){const o=document.querySelector(e);if(!o)throw new Error(`Element not found: ${e}`);return o}function h(e,o="module"){document.querySelector(`script[src="${e}"]`)||document.body.appendChild(Object.assign(document.createElement("script"),{type:o,src:e}))}function m(e){const o=document.querySelector(e);if(o.innerHTML){console.log("SearchPlaceholder: Placeholder already loaded");return}o.innerHTML=`
  <div id="placeholder-search-box-wrapper">
    <input
      id="placeholder-search-box"
      type="text"
      class="search-box"
      placeholder="Search post..."
    />
    <div class="search-modal-loading">Loading Search Modal Component... </div>
  </div>
`}const u=e=>new Promise(o=>setTimeout(o,e));class p{constructor(o){r(this,"element");this.element=document.querySelector(o)}show(){this.element.classList.add("show")}hide(){this.element.classList.remove("show")}}function w(){m("#search-placeholder-root");const e=d("#placeholder-search-box");f(e),e.addEventListener("click",()=>a(e))}async function a(e){e.blur();const o="open";console.log(`SeachPlaceholder: ${o} search modal`),h("/js/search.js");const t=new p(".search-modal-loading");t.show(),await i("#search-root"),t.hide(),s.dispatch({action:o})}function f(e){new URLSearchParams(window.location.search).get("q")!==null&&a(e)}w();
