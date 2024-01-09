export type AlertType = "warn" | "info" | "success" | "error";
export type AlertMessage = {
    value: string
    type?: AlertType
}