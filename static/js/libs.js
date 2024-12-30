var i=Object.defineProperty;var d=(o,e,t)=>e in o?i(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var c=(o,e,t)=>d(o,typeof e!="symbol"?e+"":e,t);import{c as s}from"./browser-logger.js";const n=s("search/libs");async function f(o,e){o==null||o.blur();const t="open";n==null||n.info("openSearchModal: Injecting Script for Search Modal Component (React)"),r("/js/search-modal.js");const a=new m(".search-modal-loading");a.show(),await l("#search-root"),n==null||n.info("openSearchModal: Loaded Search Modal Component (React)"),a.hide(),n==null||n.info(`openSearchModal: Emitting "${e.name}" event, action: "${t}"`),e.dispatch({action:t})}async function l(o,e=5e3){var a;const t=Date.now();for(;!((a=document.querySelector(o))!=null&&a.innerHTML);){if(Date.now()-t>e)throw n==null?void 0:n.fatal(`Element with selector ${o} not found or not loaded`);await h(100)}}function w(o){const e=document.querySelector(o);if(!e)throw n==null?void 0:n.fatal(`Element not found: ${o}`);return e}function r(o,e="module"){document.querySelector(`script[src="${o}"]`)||document.body.appendChild(Object.assign(document.createElement("script"),{type:e,src:o}))}function S(o){const e=document.querySelector(o);if(e.innerHTML){n==null||n.info("loadPlaceholder: Placeholder already loaded");return}e.innerHTML=`
  <div id="placeholder-search-box-wrapper">
    <input
      id="placeholder-search-box"
      type="text"
      class="search-box"
      placeholder="Search post..."
    />
    <div class="search-modal-loading">Loading Search Modal Component... </div>
  </div>
`}const h=o=>new Promise(e=>setTimeout(e,o));class m{constructor(e){c(this,"element");this.element=document.querySelector(e)}show(){this.element.classList.add("show")}hide(){this.element.classList.remove("show")}}export{w as g,S as l,f as o};
