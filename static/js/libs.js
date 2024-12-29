var a=Object.defineProperty;var l=(o,e,n)=>e in o?a(o,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):o[e]=n;var c=(o,e,n)=>l(o,typeof e!="symbol"?e+"":e,n);async function m(o,e){o==null||o.blur();const n="open";console.log("SearchPlaceholder: Injecting Script for Search Modal Component (React)"),d("/js/search-modal.js");const t=new i(".search-modal-loading");t.show(),await r("#search-root"),console.log("SearchPlaceholder: Loaded Search Modal Component (React)"),t.hide(),console.log(`SearchPlaceholder: Emitting "${e.name}" event, action: "${n}"`),e.dispatch({action:n})}async function r(o,e=5e3){var t;const n=Date.now();for(;!((t=document.querySelector(o))!=null&&t.innerHTML);){if(Date.now()-n>e)throw new Error(`Element with selector ${o} not found or not loaded`);await s(100)}}function u(o){const e=document.querySelector(o);if(!e)throw new Error(`Element not found: ${o}`);return e}function d(o,e="module"){document.querySelector(`script[src="${o}"]`)||document.body.appendChild(Object.assign(document.createElement("script"),{type:e,src:o}))}function p(o){const e=document.querySelector(o);if(e.innerHTML){console.log("SearchPlaceholder: Placeholder already loaded");return}e.innerHTML=`
  <div id="placeholder-search-box-wrapper">
    <input
      id="placeholder-search-box"
      type="text"
      class="search-box"
      placeholder="Search post..."
    />
    <div class="search-modal-loading">Loading Search Modal Component... </div>
  </div>
`}const s=o=>new Promise(e=>setTimeout(e,o));class i{constructor(e){c(this,"element");this.element=document.querySelector(e)}show(){this.element.classList.add("show")}hide(){this.element.classList.remove("show")}}export{u as g,p as l,m as o};
