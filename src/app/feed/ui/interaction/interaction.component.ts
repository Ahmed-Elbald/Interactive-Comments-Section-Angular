import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LetDirective } from '@ngrx/component';

import { User } from '../../utils/models/User.model';
import { DateFormatPipe } from '../../utils/pipes/date-format.pipe';
import { InteractionFormData } from '../../utils/models/interaction-form.model';
import { extractContent } from '../../utils/helpers/extract-content.helper';
import { InteractionFormComponent } from '../interaction-form/interaction-form.component';
import { VotingData } from '../../utils/models/voting-data.model';
import { childFadeInOutMerge, fadeInOutAnimation } from '../../../shared/animations/app.animations';
import { ThreadStore } from '../../data-access/thread.store';
import { ViewInteraction } from '../../utils/models/interaction.model';

@Component({
  selector: 'app-interaction',
  standalone: true,
  imports: [InteractionFormComponent, DateFormatPipe, LetDirective],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.scss',
  animations: [childFadeInOutMerge, fadeInOutAnimation()],
  providers: [ThreadStore]
})
export class InteractionComponent implements OnInit {

  // Input variables
  @Input({ required: true }) interaction!: ViewInteraction;
  @Input({ required: true }) currentUser!: User;

  // Outputs
  @Output() formSubmit = new EventEmitter<InteractionFormData>();
  @Output() voteChange = new EventEmitter<VotingData>();
  @Output() interactionDelete = new EventEmitter<string>();

  // View Children
  @ViewChild("formOpener") formOpener!: ElementRef<HTMLButtonElement>;

  // Public fields
  public isCurrentUser = false; // Does this interaction belong to the current user?
  public previousFormValue: string | null = null; // The previous input of the user into the form

  public isReplying = false;
  public isEditing = false;

  // Public methods
  ngOnInit(): void {
    this.isCurrentUser = this.interaction.user.username === this.currentUser.username;
  }

  submitForm(formData: InteractionFormData) {
    // Emit event
    this.formSubmit.emit(formData);
    // Update UI
    this.handleFormClose();
  }

  handleFormClose(currentFormInput?: string) {
    // If the form was closed via the 'Cancel' button (the form was not submitted), save the user input
    this.previousFormValue = currentFormInput ? extractContent(currentFormInput) : null;
    // Return focus to the button that opened the form
    this.formOpener?.nativeElement.focus();
    // Close the form
    this.isReplying = this.isEditing = false;
  }

  changeVote(votingData: VotingData) {
    this.voteChange.emit(votingData);
  }

  deleteInteraction(id: string) {
    this.interactionDelete.emit(id);
  }

  get votingStatus() {
    return this.currentUser.dirtyInteractions![this.interaction.id];
  }

}
