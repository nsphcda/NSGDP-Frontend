import type { Page } from "@playwright/test";

/** Runs in the browser. Keep it dependency-free. */
export async function audit(page: Page, minTap: number) {
  return page.evaluate((minTapPx) => {
    const vw = document.documentElement.clientWidth;
    const sel = (el: Element): string => {
      const id = el.id ? `#${el.id}` : "";
      const cls =
        typeof el.className === "string" && el.className.trim()
          ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
          : "";
      return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 80);
    };
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return (
        r.width > 0 &&
        r.height > 0 &&
        cs.visibility !== "hidden" &&
        cs.display !== "none" &&
        Number(cs.opacity) > 0
      );
    };
    // An element inside a horizontally *scrollable* box (table wrapper,
    // carousel) may extend past the screen: the box scrolls, the page does not.
    // overflow: hidden/clip is NOT a scroller: whatever it cuts off is lost.
    const inScroller = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true;
      }
      return false;
    };
    // Decorative boxes (background blobs, glow effects) may bleed off-screen
    // harmlessly. Only content a person reads or taps counts as clipped.
    const meaningful = (el: Element) =>
      el.matches("img,video,canvas,button,a[href],input,select,textarea,table,iframe") ||
      Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
      );

    const scrollWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    );

    const overflowing: Array<{ s: string; right: number }> = [];
    const tiny: string[] = [];
    const smallText: Array<{ s: string; px: number }> = [];
    // iOS Safari zooms the page when a text field under 16px gets focus.
    const zoomInputs: string[] = [];

    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);

      // Map tiles/controls extend past their container by design.
      const inMap = el.closest(".leaflet-container, .maplibregl-map, .mapboxgl-map");
      if (r.right > vw + 1 && cs.position !== "fixed" && !inMap && meaningful(el) && !inScroller(el)) {
        overflowing.push({ s: sel(el), right: Math.round(r.right) });
      }

      const interactive =
        el.matches("a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=menuitem],summary") &&
        !el.closest("[aria-hidden=true]");
      // Tap targets matter on phones; tablets are held to the desktop rules. Map markers are map content.
      if (
        interactive &&
        vw < 768 &&
        !el.closest(".leaflet-marker-pane, .leaflet-control-attribution") &&
        (r.width < minTapPx || r.height < minTapPx)
      ) {
        // Inline links inside a sentence are exempt (WCAG 2.5.8 inline exception).
        const inline = el.tagName === "A" && cs.display === "inline";
        if (!inline && r.width > 0) tiny.push(`${sel(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }

      // iPhone only: tablets and desktops do not auto-zoom.
      if (
        vw < 600 &&
        el.matches("input:not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=range]):not([type=file]):not([type=submit]):not([type=button]),textarea,select") &&
        parseFloat(cs.fontSize) < 16 &&
        !el.closest("[aria-hidden=true]")
      ) {
        zoomInputs.push(`${sel(el)} ${parseFloat(cs.fontSize)}px`);
      }

      if (el.childNodes.length) {
        const hasText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 2,
        );
        const px = parseFloat(cs.fontSize);
        // Map attribution text is mandated by the tile providers.
        if (hasText && px < 12 && !el.closest(".leaflet-control-attribution")) {
          smallText.push({ s: sel(el), px });
        }
      }
    }

    // Keep the worst offenders only: a wide container makes all its children "overflow".
    overflowing.sort((a, b) => b.right - a.right);
    return {
      vw,
      scrollWidth,
      hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
      overflowing: overflowing.slice(0, 6),
      overflowCount: overflowing.length,
      tiny: tiny.slice(0, 8),
      tinyCount: tiny.length,
      smallText: smallText.slice(0, 5),
      smallTextCount: smallText.length,
      zoomInputs: zoomInputs.slice(0, 5),
      zoomInputCount: zoomInputs.length,
    };
  }, minTap);
}
