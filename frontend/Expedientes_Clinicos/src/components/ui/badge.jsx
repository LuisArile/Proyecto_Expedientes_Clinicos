import * as React from "react";

// Estilos base y variantes en objetos planos (CSS puro de Tailwind)
const badgeBaseStyles = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden";

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground shadow",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
  outline: "text-foreground border-gray-200", // Añadido un borde por defecto para outline
};

function Badge({
  className = "",
  variant = "default",
  ...props
}) {
  // Lógica de combinación de clases sin librerías
  // Buscamos el estilo de la variante o usamos el 'default' si no existe
  const variantClass = badgeVariants[variant] || badgeVariants.default;

  const classes = `
    ${badgeBaseStyles} 
    ${variantClass} 
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <span
      data-slot="badge"
      className={classes}
      {...props}
    />
  );
}

export { Badge, badgeVariants };