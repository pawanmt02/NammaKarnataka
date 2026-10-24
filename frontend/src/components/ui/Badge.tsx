"use client";

import { motion } from "framer-motion";
import type { BadgeType } from "@/types";
import { BADGE_INFO } from "@/data/regions";

interface BadgeProps {
  badge: BadgeType;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-base",
  md: "h-12 w-12 text-xl",
  lg: "h-16 w-16 text-3xl",
};

const labelSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export default function Badge({ badge, size = "md" }: BadgeProps) {
  const info = BADGE_INFO[badge];

  if (!info) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col items-center gap-1"
      title={info.description}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-white/10 shadow-lg ring-2 ring-yellow-400/30 ${sizeClasses[size]}`}
      >
        <span role="img" aria-label={info.name}>
          {info.icon}
        </span>
      </div>
      <span
        className={`max-w-[80px] truncate text-center font-medium text-gray-300 ${labelSizes[size]}`}
      >
        {info.name}
      </span>
    </motion.div>
  );
}
