import"./modulepreload-polyfill.js";function a(r){const o=new URL(r).pathname.replace(/\/$/,""),e=o.split("-");if(e.length>1)return e[e.length-1]===""?null:e[e.length-1];{const t=o.split("/");return t.length>1?t[t.length-1]===""?null:t[t.length-1]:null}}(async()=>{if(typeof window>"u")return;const r=window.location.href;console.log(`Current URL: ${r}`);let n=null;const o=a(r);o&&(n=o,console.log(`Extracted ID from path: ${n}`));const t=new URL(r).searchParams.get("id");if(t&&(n=t,console.log(`Extracted ID from search params: ${n}`)),n===null){console.log("No ID found in the URL");return}console.log(`Extracted ID: ${n}`);const l=(await(await fetch("/api/id-mapper.json")).json())[n];l&&window.location.assign(l.path)})();
