// Estilos en objetos constantes
const variantStyles = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeStyles = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "size-9",
};

const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

// 2. Componente de Botón
function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}) {
 
  const classes = `
    ${baseStyles} 
    ${variantStyles[variant] || variantStyles.default} 
    ${sizeStyles[size] || sizeStyles.default} 
    ${className}
  `.replace(/\s+/g, ' ').trim(); 

  return (
    <button
      data-slot="button"
      className={classes}
      {...props}
    />
  );
}

export { Button };

