"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

interface MediaCardProps {
  image: string;
  title?: string;
  subtitle?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MediaCard({
  image,
  title,
  subtitle,
  onEdit,
  onDelete,
}: MediaCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title || "Media"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-white text-gray-800 p-2.5 rounded-lg hover:bg-teal-50 transition-colors shadow"
            >
              <FaEdit size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-white text-red-500 p-2.5 rounded-lg hover:bg-red-50 transition-colors shadow"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      {(title || subtitle) && (
        <div className="p-3">
          {title && (
            <p className="text-sm font-medium text-gray-900 truncate">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
