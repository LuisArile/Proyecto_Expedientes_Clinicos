import { Activity, Users, BarChart3, Pill, TestTube, UserCheck, Calendar, PillBottle, NotebookText, Stethoscope, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

  const ICON_MAP = { Users, BarChart3, Pill, TestTube, UserCheck, Activity, Calendar, PillBottle, NotebookText, Stethoscope, FileText };

export function StatCard({ title, value, icon, iconColor = "text-gray-500", bgColor = "bg-white", border, footer, onClick, variant = "default" }) {

  const isLarge = variant === "large";

  const IconComponent = typeof icon === "string" ? ICON_MAP[icon] || Activity : icon || Activity;
  
  return (
    <Card
      className={`
        ${bgColor}
        ${isLarge ? `border-l-4 ${border} hover:shadow-md` : "shadow-sm border-slate-200"}
        transition-shadow
        ${onClick ? "cursor-pointer" : ""}
      `}
      onClick={onClick}
    >
      {isLarge ? (
        <>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              {title}
            </CardTitle>
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          </CardHeader>

          <CardContent>
            <div className={`text-3xl font-bold ${iconColor}`}>
              {value}
            </div>
            {footer && (
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {footer}
              </p>
            )}
          </CardContent>
        </>
      ) : (
        <>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-slate-50 ${iconColor}`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}