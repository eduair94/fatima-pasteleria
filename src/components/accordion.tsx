"use client";

import { useId, useState } from "react";

import { Icon } from "@/components/icon";
import type { FaqItem } from "@/lib/site";

export function Accordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const id = useId();

  return (
    <div className="border-t border-line-200">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q} className="border-b border-line-200">
            <h3 className="m-0">
              <button
                type="button"
                className="fp-acc__btn"
                aria-expanded={expanded}
                aria-controls={`${id}-panel-${index}`}
                id={`${id}-btn-${index}`}
                onClick={() => setOpen(expanded ? null : index)}
              >
                {item.q}
                <span className="fp-acc__caret">
                  <Icon name="chevron-down" size={20} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-panel-${index}`}
              role="region"
              aria-labelledby={`${id}-btn-${index}`}
              hidden={!expanded}
              className="max-w-[34rem] pb-5 leading-relaxed text-brown-700"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
