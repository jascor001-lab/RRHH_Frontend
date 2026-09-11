import { ReactNode } from "react";

export default function Card({
  title,
  value,
  icon,
  subtitle
}: {
  title: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="tech-card flex items-center gap-3 p-4 min-w-0">

      <div className="
        p-3
        bg-green-500/20
        rounded-xl
        text-green-400
        shrink-0
      ">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="
          text-xs
          sm:text-sm
          text-gray-300
          truncate
        ">
          {title}
        </p>

        <h2 className="
          text-base
          sm:text-xl
          font-bold
          truncate
          leading-tight
        ">
          {value}
        </h2>

        {subtitle && (
          <p className="
            text-[11px]
            sm:text-xs
            text-gray-400
            truncate
          ">
            {subtitle}
          </p>
        )}

      </div>
    </div>
  );
}