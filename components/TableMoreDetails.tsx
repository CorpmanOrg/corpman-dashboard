import React, { useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useClickAway } from "ahooks";
import { TableActionOption } from "@/types/types";

interface TableMoreDetailsProps {
  options: TableActionOption[];
  itemOnClick: (item: TableActionOption) => void;
}

const TableMoreDetails: React.FC<TableMoreDetailsProps> = ({ options, itemOnClick }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ useClickAway from ahooks (supports click + touch)
  useClickAway(() => {
    if (open) setOpen(false);
  }, containerRef);

  return (
    <div ref={containerRef} className="relative">
      <EllipsisVertical className="cursor-pointer block mx-auto peer" onClick={() => setOpen((p) => !p)} />
      {open && (
        <ul className="absolute bg-white text-center right-[4.5rem] -top-5 shadow z-[2] rounded-lg">
          {options.map((itm) => (
            <li
              key={itm.key}
              className="min-w-max px-2 py-4 hover:bg-yellow-100/[0.2] cursor-pointer border-b last:border-b-0 flex items-center gap-2"
              onClick={() => { itemOnClick(itm); setOpen(false); }}
            >
              {itm.icon && <span>{itm.icon}</span>}
              {itm.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableMoreDetails;
