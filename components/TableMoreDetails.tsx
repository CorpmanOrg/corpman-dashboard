import React, { useRef, useState } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useClickAway } from "ahooks";
import { TableActionOption } from "@/types/types";

interface TableMoreDetailsProps {
  options: TableActionOption[];
  itemOnClick: (item: TableActionOption) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  view: <Eye className="w-4 h-4" />,
  edit: <Pencil className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  approve: <CheckCircle className="w-4 h-4" />,
  reject: <XCircle className="w-4 h-4" />,
};

const TableMoreDetails: React.FC<TableMoreDetailsProps> = ({ options, itemOnClick }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    if (open) setOpen(false);
  }, containerRef);

  // 🔹 Dynamic grid + width
  const cols = Math.min(options.length, 3); // up to 3 per row
  const widthClass =
    options.length === 1 ? "w-10" : options.length === 2 ? "w-20" : "w-32";

  // 🔹 Dynamic positioning (closer if fewer actions)
  const positionClass =
    options.length === 1
      ? "left-0 -top-10" // snug above
      : options.length === 2
      ? "-left-4 -top-10"
      : "-left-8 -top-10"; // wider for 3+

  return (
    <div ref={containerRef} className="relative flex justify-end items-end h-full">
      <EllipsisVertical
        className="cursor-pointer block"
        onClick={() => setOpen((p) => !p)}
      />
      {open && (
        <div
          className={`absolute ${positionClass} mt-2 ${widthClass} 
                      bg-white dark:bg-gray-800 shadow-lg 
                      ring-1 ring-black/5 z-20 rounded-lg border px-2 py-2 
                      grid grid-cols-${cols} gap-2 overflow-hidden`}
        >
          {options.map((itm) => (
            <button
              key={itm.key}
              className="hover:bg-blue-50 dark:hover:bg-blue-900 rounded-full p-1 transition-colors flex items-center justify-center"
              title={itm.label}
              onClick={() => {
                itemOnClick(itm);
                setOpen(false);
              }}
            >
              {iconMap[itm.key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableMoreDetails;
