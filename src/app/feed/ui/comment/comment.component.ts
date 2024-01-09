import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ViewComment } from '../../utils/models/comment.model';
import { ViewReply } from '../../utils/models/reply.model';
import { User } from '../../utils/models/User.model';
import { DateFormatPipe } from '../../utils/pipes/date-format.pipe';
import { CommentFormData } from '../../utils/models/comment-form.model';
import { extractContent } from '../../utils/helpers/extract-content.helper';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { VotingData } from '../../utils/models/voting-data.model';
import { childFadeInOutAnimatoin, fadeInOutAnimation } from '../../../shared/animations/app.animations';
import { CommentStore } from '../../data-access/comment.store';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommentFormComponent, DateFormatPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  animations: [childFadeInOutAnimatoin, fadeInOutAnimation()],
  providers: [CommentStore]
})
export class CommentComponent implements OnInit {

  // Input variables
  @Input({ required: true }) comment!: ViewComment | ViewReply;
  @Input({ required: true }) currentUser!: User;

  // Outputs
  @Output() formSubmit = new EventEmitter<CommentFormData>();
  @Output() voteChange = new EventEmitter<VotingData>();
  @Output() commentDelete = new EventEmitter<string>();

  // View Children
  @ViewChild("formOpener") formOpener!: ElementRef<HTMLButtonElement>;

  // Public fields
  public isCurrentUser = false;
  public previousFormValue: string | null = null;

  public isReplying = false;
  public isEditing = false;

  // Public methods
  ngOnInit(): void {
    this.isCurrentUser = this.comment.user.username === this.currentUser.username;
  }

  submitForm(formData: CommentFormData) {
    // Emit event
    this.formSubmit.emit(formData);
    // Update UI
    this.handleFormClose();
  }

  handleFormClose(currentFormInput?: string) {
    this.previousFormValue = currentFormInput ? extractContent(currentFormInput) : null;
    this.formOpener?.nativeElement.focus();
    this.isReplying = this.isEditing = false;
  }

  changeVote(votingData: VotingData) {
    this.voteChange.emit(votingData);
  }

  deleteComment(id: string) {
    this.commentDelete.emit(id);
  }

  isAReply(c = this.comment): c is ViewReply {
    return (c as ViewReply).parentId ? true : false;
  }

  get votingStatus() {
    return this.currentUser.dirtyComments![this.comment.id];
  }

}
