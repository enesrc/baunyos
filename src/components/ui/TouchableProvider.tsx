"use client";

import { useEffect, useRef } from "react";

/**
 * Document seviyesinde touch event delegation.
 * [data-touchable] olan herhangi bir elemente dokunulduğunda
 * [data-touched] attribute'ü eklenir → myhover: / group-myhover: CSS variant'ları tetiklenir.
 * Parmak kalkınca 150ms sonra kaldırılır. Scroll yapılırsa anında iptal edilir.
 */
export default function TouchableProvider() {
  const timers = useRef<Map<Element, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const clear = (el: Element) => {
      const t = timers.current.get(el);
      if (t) { clearTimeout(t); timers.current.delete(el); }
    };

    const onStart = (e: TouchEvent) => {
      const el = (e.target as Element)?.closest("[data-touchable]");
      if (!el) return;
      clear(el);
      // Anında göster — scroll olursa onMove zaten kaldırır
      el.setAttribute("data-touched", "");
    };

    const onEnd = (e: TouchEvent) => {
      const el = (e.target as Element)?.closest("[data-touchable]");
      if (!el) return;
      // 150ms sonra kaldır — kullanıcı efekti görsün
      if (el.hasAttribute("data-touched")) {
        const t = setTimeout(() => {
          el.removeAttribute("data-touched");
          timers.current.delete(el);
        }, 150);
        timers.current.set(el, t);
      }
    };

    const onMove = (e: TouchEvent) => {
      const el = (e.target as Element)?.closest("[data-touchable]");
      if (!el) return;
      clear(el);
      el.removeAttribute("data-touched");
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onEnd, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
      document.removeEventListener("touchmove", onMove);
    };
  }, []);

  return null;
}
