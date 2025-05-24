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
    const url = el.dataset.src || el.src;
    if (!url || url.startsWith("blob:")) continue;

    try {
      const res = await fetch(url, { credentials: "omit" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Replace the source
      if ("src" in el) {
        el.src = blobUrl;
      } else if ("data" in el) {
        el.data = blobUrl; // used by <object>
      }

      // Disable interaction
      el.setAttribute("draggable", "false");
      el.setAttribute("loading", "lazy");
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.addEventListener("mousedown", (e) => e.preventDefault());
      el.addEventListener("touchstart", (e) => e.preventDefault());
    } catch (err) {
      console.error("BlobShield failed to protect:", url, err);
    }
  }

document.addEventListener("contextmenu", (e) => e.preventDefault());
})();
