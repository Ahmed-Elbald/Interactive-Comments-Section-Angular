// Extract the content of the interaction (remove the @ if it exists)
export function extractContent(value: string) {
    const trimmedValue = value.trim();
    return trimmedValue[0] === "@" ? trimmedValue.split(" ").slice(1).join(" ") : trimmedValue;
}