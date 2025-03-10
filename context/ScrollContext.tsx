import React, { createContext } from "react";

export const ScrollContext = createContext<{
  scrollableRef: React.RefObject<HTMLDivElement> | null;
}>({ scrollableRef: null });
