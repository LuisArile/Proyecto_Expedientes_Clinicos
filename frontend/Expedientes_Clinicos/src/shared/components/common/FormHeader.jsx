import { Activity } from "lucide-react";

export function FormHeader({ 
    title = "Clínica Médica Vida Plena", 
    subtitle = "Sistema de Gestión Hospitalaria", 
    icon: Icon = Activity,
    compact = false,
    align = "center" 
}) {
  const isLeft = align === "left";

  return (
    <div className={`flex ${isLeft ? 'flex-row items-center gap-4 text-left p-4' : 'flex-col items-center text-center py-4'}`}>
      
      <div className={`flex-shrink-0 ${
        isLeft 
          ? 'p-2 bg-blue-600 rounded-lg shadow-sm' // Estilo cuadrado azul
          : `bg-blue-100 rounded-full ${compact ? 'p-2' : 'p-4'}` // Estilo circular
      }`}>
        <Icon className={`${isLeft ? 'text-white' : 'text-blue-600'} w-6 h-6`} />
      </div>
      
      <div className="flex flex-col">
        <h1 className={`${isLeft ? 'text-2xl text-blue-900' : 'text-xl text-gray-800'} font-semibold tracking-tight`}>
          {title}
        </h1>
        
        {subtitle && (
          <p className={`${isLeft ? 'text-gray-600' : 'text-gray-500'} text-sm mt-0.5`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}