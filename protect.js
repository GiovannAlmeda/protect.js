(async function blobShieldProtect() {
  const currentDomain = window.location.hostname;
  const allowedDomains = ["vaultembed.com", "app.gohighlevel.com"]; // <- update this list later

  if (!allowedDomains.includes(currentDomain)) return;

  const selector = document.currentScript.dataset.selector || "img,video";
  const elements = document.querySelectorAll(selector);

  for (const el of elements) {
    const url = el.dataset.src || el.src;
    try {
      const res = await fetch(url, { credentials: "omit" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      el.src = blobUrl;
      el.setAttribute("draggable", "false");
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.addEventListener("mousedown", (e) => e.preventDefault());
      el.addEventListener("touchstart", (e) => e.preventDefault());
    } catch (err) {
      console.error("BlobShield failed for", url, err);
    }
  }
})();

Add initial protect.js file
