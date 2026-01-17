"use client";

import { useEffect, useState } from "react";

export function Copyright() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <span>
      © {year || 2026} Lifterico Delivery App
    </span>
  );
}