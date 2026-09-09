import React from "react";
import { Link } from "react-router-dom";
import type { ClientEntity } from "@alhadab/shared";
import { Building2 } from "lucide-react";

export interface ClientLogoProps {
  client: ClientEntity;
  isAr: boolean;
  className?: string;
}

export const ClientLogo: React.FC<ClientLogoProps> = ({
  client,
  isAr,
  className = ""
}) => {
  return (
    <Link
      to={`/projects?clientCategory=${client.category}`}
      className={`group flex flex-col items-center justify-center p-5 rounded-[8px] bg-white border border-sand-200 transition-all duration-200 hover:border-copper-500/40 hover:shadow-elevation-2 hover:bg-sand-50/50 text-center ${className}`}
    >
      <div className="h-12 w-12 rounded-full bg-sand-100 border border-sand-200 group-hover:bg-copper-50 group-hover:border-copper-200 flex items-center justify-center text-basalt-700 group-hover:text-copper-600 transition-colors mb-3">
        {client.monogram ? (
          <span className="font-mono font-bold text-xs tracking-wider">
            {client.monogram.slice(0, 4)}
          </span>
        ) : (
          <Building2 className="h-5 w-5" />
        )}
      </div>

      <div className="text-xs font-bold text-basalt-900 group-hover:text-copper-600 transition-colors line-clamp-2 leading-snug">
        {isAr ? client.nameAr : client.nameEn}
      </div>

      <div className="text-[10px] text-basalt-500 font-mono mt-1">
        {client.category.replace("_", " ")}
      </div>
    </Link>
  );
};
