export function FormSection({ title, children }) {
    return (
        <div className="space-y-4">
            {title && (
                <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider border-b border-blue-50 pb-2">
                    {title}
                </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}