import"./modulepreload-polyfill.js";import{g as p,o as d}from"./libs.js";import{s as h}from"./search-placeholder2.js";function y(t,a,c={disableTextInputs:!0}){let o=[];function s(e){const n=e.target,f=n instanceof HTMLTextAreaElement||n instanceof HTMLInputElement&&(!n.type||n.type==="text")||((n==null?void 0:n.isContentEditable)??!1);if(e.repeat)return;if(c.disableTextInputs&&f){e.stopPropagation();return}const l={Control:e.ctrlKey,Alt:e.altKey,Command:e.metaKey,Shift:e.shiftKey};if(t.includes("+")){const r=t.split("+");if(Object.keys(l).includes(r[0])){const u=r.pop();r.every(m=>l[m])&&u===e.key&&a(e)}else{if(r[o.length]===e.key){if(r[r.length-1]===e.key&&o.length===r.length-1){a(e),o=[];return}o=[...o,e.key];return}if(o.length>0){o=[];return}}}t===e.key&&a(e)}return window.addEventListener("keydown",s),{unregister:()=>{window.removeEventListener("keydown",s)}}}function i(){const t=document.querySelector("#placeholder-search-box");d(t,h)}function g(t){new URLSearchParams(window.location.search).get("q")!==null&&d(t,h)}function w(){const t=document.querySelector("#placeholder-search-box");g(t),Object.entries({"Control+p":i,"Command+p":i}).forEach(([o,s])=>{y(o,e=>{e.preventDefault(),s(e)})}),p("#search-header").addEventListener("click",i),console.log("Commander: Initialized")}w();