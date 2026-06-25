"use client";

import React, { useState } from "react";
import Header from "./Header";

// Обёртка над Header с собственным состоянием меню —
// для отдельных страниц (блог, статьи), где нет общего состояния главной.
export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />;
}
