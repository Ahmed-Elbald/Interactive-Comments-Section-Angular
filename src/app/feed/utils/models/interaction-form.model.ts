import { FormControl } from "@angular/forms";

export type InteractionFormPurpose = "comment" | "reply";
export type InteractionFormMode = "new" | "edit";

export interface InteractionFormData {
    content: string,
    parentInteractionId?: string,
    interactionId?: string,
}

export interface InteractionForm {
    body: FormControl<string>
}