import { Button } from "@components/ui/button";

/**
 * Renderiza acciones de forma desacoplada
 */
const renderActions = (actions, row) => (
    <div className="flex justify-center gap-1 flex-wrap">
        {actions
            .filter(action => !action.show || action.show(row))
            .map((action, index) => {
                const Icon = action.icon;

                return (
                    <Button
                        key={action.key ?? `action-${index}`}
                        size={action.size || "icon"}
                        variant={action.variant || "ghost"}
                        title={
                            typeof action.title === "function"
                                ? action.title(row)
                                : action.title
                        }
                        onClick={() => action.onClick(row)}
                        className={
                            typeof action.className === "function"
                                ? action.className(row)
                                : action.className
                        }
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        {action.label && (
                            <span className="ml-1">
                                {typeof action.label === "function" 
                                    ? action.label(row) 
                                    : action.label}
                            </span>
                        )}
                    </Button>
                );
            })}
    </div>
);

export const buildColumns = ({ columns = [], actions = [] }) => {

    if(!actions.length) return columns;

    return [
        ...columns,
        {
            id: "actions",
            header: "Acciones",
            className: "text-center",
            render: (row) => renderActions(actions, row)
        }
    ];
};