"use client";

import { useEffect } from "react";
import type { Lang } from "./config";

export default function LangClientSync({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}