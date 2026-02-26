"use client";

import { useEffect } from "react";
import type { Locale } from "./config";

export default function LocaleClientSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}