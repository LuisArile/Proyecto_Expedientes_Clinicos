
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Button } from "@components/ui/button";

const colorStyles = {
    blue: {
        border: "border-blue-200",
        header: "from-blue-50",
        bg: "bg-blue-600",
        text: "text-blue-900",
        button: "bg-blue-600 hover:bg-blue-700"
    },
    green: {
        border: "border-green-200",
        header: "from-green-50",
        bg: "bg-green-600",
        text: "text-green-900",
        button: "bg-green-600 hover:bg-green-700"
    }
};

export function CardCita({ color = "blue", Icon, title, description, content, highlight, buttonText, onClick, ButtonIcon }) {
    
    const styles = colorStyles[color] || colorStyles.blue;

    return (
        <Card className={`${styles.border} hover:shadow-lg transition-shadow cursor-pointer`}>
            <CardHeader className={`bg-gradient-to-r ${styles.header} to-white`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 ${styles.bg} rounded-lg`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className={styles.text}>{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                    {content} <strong>{highlight}</strong>.
                </p>

                <Button onClick={onClick} className={`w-full ${styles.button}`}>
                    {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}