import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { User } from '../../utils/models/User.model';
import { CommentForm, CommentFormData, CommentFormMode, CommentFormPurpose } from '../../utils/models/comment-form.model';
import { ThreadResponseValidator } from '../../utils/validators/thread-response.validator';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent implements OnInit, AfterViewInit {

  // Input variables
  @Input() commentId: string | undefined = undefined; // If the form is used to edit a comment/reply
  @Input() commentParentId: string | undefined = undefined; // If the form is used to create a reply

  @Input() replyingTo: string | undefined = undefined;
  @Input() defaultValue: string | undefined = undefined;
  @Input() currentUserImg: User["image"] | undefined = undefined;

  // Outputs
  @Output() formSubmit = new EventEmitter<CommentFormData>()
  @Output() formClose = new EventEmitter<string | undefined>()

  // View Childs
  @ViewChild("contentControl") public contentControl!: ElementRef;

  // Public fields
  public commentForm!: FormGroup<CommentForm>;

  // Public methods
  ngOnInit(): void {

    // Initialize form
    const formInitialValue = (this.replyingTo ? `@${this.replyingTo} ` : "") + (this.defaultValue || "");
    this.commentForm = new FormGroup({
      body: new FormControl((formInitialValue), { validators: [ThreadResponseValidator], nonNullable: true })
    });

  }

  ngAfterViewInit(): void {
    if (!this.isNewComment) // Put focus on the form when it opens
      this.contentControl.nativeElement.focus();
  }

  submitComment() {
    if (this.commentForm.valid) {
      this.formSubmit.emit({
        content: this.commentForm.controls.body.value,
        commentId: this.commentId,
        parentCommentId: this.commentParentId
      });
      this.commentForm.reset();
    }
  }

  closeForm() {
    this.formClose.emit(this.commentForm.controls.body.value);
  }

  // Getters
  get mode(): CommentFormMode {
    return this.commentId ? "edit" : "new"
  }

  get purpose(): CommentFormPurpose {
    return this.commentParentId || this.replyingTo ? "reply" : "comment";
  }

  get btnTxt(): "reply" | "update" | "send" {
    return this.mode === "edit" ? "update" : this.purpose === "reply" ? "reply" : "send";
  }

  get isNewComment(): boolean {
    return this.purpose === "comment" && this.mode === "new"
  }
}
