import { FormControl } from "@angular/forms";

export type CommentFormPurpose = "comment" | "reply";
export type CommentFormMode = "new" | "edit";

export interface CommentFormData {
    content: string,
    parentCommentId?: string,
    commentId?: string,
}

export interface CommentForm {
    body: FormControl<string>
}