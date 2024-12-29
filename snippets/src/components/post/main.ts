/**
 * Post Template Extension, It is as entry point for the post template.
 * @param id Page ID
 * @returns 
 */
export function postExtension(id: string | undefined) {
  if (typeof window === 'undefined') return;
  const currentUrl = new URL(window.location.href);
  // Empty string is considered as undefined.
  if (!id) {
    console.log('The page id is not defined. Removing the id from the URL.');
    currentUrl.searchParams.delete('id');
    history.replaceState(null, "", currentUrl.toString());
    return;
  }
  currentUrl.searchParams.set('id', id);
  history.replaceState(null, "", currentUrl.toString());
  console.log(`The page id is set to ${id}.`);
}

/**
 * วิธีการรัน JavaScript ข้างนอก Bundle ของ Webpack และการเรียกใช้ jQuery ภายใน Webpack
 * Ref: https://www.thadaw.com/posts/%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A3%E0%B8%B1%E0%B8%99-java-script-%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%99%E0%B8%AD%E0%B8%81-bundle-%E0%B8%82%E0%B8%AD%E0%B8%87-webpack-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%81%E0%B9%83%E0%B8%8A%E0%B9%89-j-query-%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99-webpack-2kbbdkt/
 */

(function (window) {
  window.EntryPoint = {
    postExtension
  }
})(window);