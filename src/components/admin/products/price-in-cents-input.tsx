"use client";

import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatter";
import { ComponentProps, useState } from "react";

export default function PriceInCentsInput(props: ComponentProps<typeof Input>) {
  const [priceInCents, setPriceInCents] = useState<number>();

  return (
    <>
      <Input
        {...props}
        onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
      />
      <div className="text-muted-foreground">
        {formatCurrency((priceInCents || 0) / 100)}
      </div>
    </>
  );
}
