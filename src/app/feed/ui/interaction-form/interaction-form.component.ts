import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { User } from '../../utils/models/User.model';
import { InteractionForm, InteractionFormData, InteractionFormMode, InteractionFormPurpose } from '../../utils/models/interaction-form.model';
import { ThreadInteractionValidator } from '../../utils/validators/thread-interaction.validator';

@Component({
  selector: 'app-interaction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './interaction-form.component.html',
  styleUrl: './interaction-form.component.scss'
})
export class InteractionFormComponent implements OnInit, AfterViewInit {

  // Input variables
  @Input() interactionId: string | undefined = undefined; // If the form is used to edit an interaction
  @Input() interactionParentId: string | undefined = undefined; // If the form is used to create a reply

  @Input() replyingTo: string | undefined = undefined;
  @Input() defaultValue: string | undefined = undefined;
  @Input() currentUserImg: User["image"] | undefined = undefined;

  // Outputs
  @Output() formSubmit = new EventEmitter<InteractionFormData>()
  @Output() formClose = new EventEmitter<string | undefined>()

  // View Childs
  @ViewChild("contentControl") public contentControl!: ElementRef;

  // Public fields
  public interactionForm!: FormGroup<InteractionForm>;

  // Public methods
  ngOnInit(): void {

    // Initialize form
    const formInitialValue = (this.replyingTo ? `@${this.replyingTo} ` : "") + (this.defaultValue || "");
    this.interactionForm = new FormGroup({
      body: new FormControl((formInitialValue), { validators: [ThreadInteractionValidator], nonNullable: true })
    });

  }

  ngAfterViewInit(): void {
    // If the form was opened by the user (To avoid having the main form getting focused on page load)
    if (!this.isNewInteraction)
      // Put focus on the form when it opens
      this.contentControl.nativeElement.focus();
  }

  submitForm() {
    if (this.interactionForm.valid) {
      this.formSubmit.emit({
        content: this.interactionForm.controls.body.value,
        interactionId: this.interactionId,
        parentInteractionId: this.interactionParentId
      });
      this.interactionForm.reset();
    }
  }

  closeForm() {
    this.formClose.emit(this.interactionForm.controls.body.value);
  }

  // Getters
  get mode(): InteractionFormMode {
    return this.interactionId ? "edit" : "new"
  }

  get purpose(): InteractionFormPurpose {
    return this.interactionParentId || this.replyingTo ? "reply" : "comment";
  }

  get btnTxt(): "reply" | "update" | "send" {
    return this.mode === "edit" ? "update" : this.purpose === "reply" ? "reply" : "send";
  }

  get isNewInteraction(): boolean {
    return this.purpose === "comment" && this.mode === "new"
  }
}
