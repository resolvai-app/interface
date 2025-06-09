"use client";

import { useEffect } from "react";
import { initFetchInterceptor } from "@/lib/fetch-interceptor";

export function FetchInterceptorProvider() {
  useEffect(() => {
    initFetchInterceptor();
  }, []);

  return null;
}
