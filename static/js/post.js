import"./modulepreload-polyfill.js";function n(e){if(typeof window>"u")return;const t=new URL(window.location.href);if(!e){console.log("The page id is not defined. Removing the id from the URL."),t.searchParams.delete("id"),history.replaceState(null,"",t.toString());return}t.searchParams.set("id",e),history.replaceState(null,"",t.toString()),console.log(`The page id is set to ${e}.`)}(function(e){e.EntryPoint={postExtension:n}})(window);
