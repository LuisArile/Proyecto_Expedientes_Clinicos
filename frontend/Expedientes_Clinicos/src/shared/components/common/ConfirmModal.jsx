import { Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  icon: Icon,
  confirmColor = "bg-green-600 hover:bg-green-700",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden bg-white">
        
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex flex-col items-center gap-2 pt-2">
            {Icon && <Icon className="h-10 w-10 text-slate-700" />}
            <CardTitle className="text-lg font-bold text-slate-900 text-center">
              {title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-6 px-6 space-y-6 text-center">
          <p className="text-slate-600">{description}</p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {cancelText}
            </Button>

            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 ${confirmColor}`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}