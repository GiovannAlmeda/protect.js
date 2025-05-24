(async function blobShieldProtect() {
  const currentDomain = window.location.hostname;

  const allowedDomains = [
    "vaultembed.com",
    "mapmagnet.co",
    "app.gohighlevel.com",
    "localhost",
    "127.0.0.1"
  ];

  if (!allowedDomains.includes(currentDomain)) return;

  const selector =
    document.currentScript.dataset.selector ||
    "img,video,audio,iframe,object,embed";

  const elements = document.querySelectorAll(selector);

  for (const el of elements) {
    let url = el.dataset?.src || el.src;

    // ✅ Check for <video><source src="..."></video>
    if (!url && el.tagName.toLowerCase() === "video") {
      const source = el.querySelector("source");
      if (source) {
        url = source.getAttribute("src");
      }
    }

    // ✅ Skip if nothing to protect or already blobbed
    if (!url || url.startsWith("blob:")) continue;

    try {
      const res = await fetch(url, { credentials: "omit" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      // ✅ Replace the source on appropriate element
      if ("src" in el) {
        el.src = blobUrl;
      } else if ("data" in el) {
        el.data = blobUrl;
      }

      // ✅ Handle <video><source> by removing <source> and setting .src
      if (el.tagName.toLowerCase() === "video") {
        const source = el.querySelector("source");
        if (source) source.remove();
        el.src = blobUrl;
      }

      // 🛡️ Protection features
      el.setAttribute("draggable", "false");
      el.setAttribute("loading", "lazy");
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.addEventListener("mousedown", (e) => e.preventDefault());
      el.addEventListener("touchstart", (e) => e.preventDefault());
    } catch (err) {
      console.error("BlobShield failed to protect:", url, err);
    }
  }

  // ✅ Global right-click block
  document.addEventListener("contextmenu", (e) => e.preventDefault());
})();
