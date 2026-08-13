import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  id,
  center = false,
  action,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  id?: string;
  center?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        center ? "items-center text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={`flex flex-col gap-3 ${center ? "items-center" : ""}`}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id} className="t-h2">
          {title}
        </h2>
        <hr className="rule-gold" />
        {sub ? <p className="max-w-[34rem] text-sm text-brown-500">{sub}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
