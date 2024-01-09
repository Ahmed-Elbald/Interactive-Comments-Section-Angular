import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LetDirective } from '@ngrx/component';

import { CommentComponent } from '../../ui/comment/comment.component';
import { CommentsStore } from '../../data-access/comments.store';
import { CommentFormComponent } from '../../ui/comment-form/comment-form.component';
import { CommentFormData } from '../../utils/models/comment-form.model';
import { VotingData } from '../../utils/models/voting-data.model';
import { fadeInOutAnimation } from '../../../shared/animations/app.animations';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentComponent, CommentFormComponent, AsyncPipe, LetDirective],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  providers: [CommentsStore],
  animations: [fadeInOutAnimation()]
})
export class CommentsComponent implements OnInit {

  // Deps
  private store = inject(CommentsStore);

  // Public fields
  public currentUser$ = this.store.currentUser$;
  public comments$ = this.store.comments$;

  // Public methods
  ngOnInit(): void {
    this.store.init();
  }

  submitCommentForm(formData: CommentFormData) {
    this.store.submitCommentForm(formData)
  }

  changeCommentScore(votingData: VotingData) {
    this.store.changeScoreHanlder(votingData as Required<VotingData>)
  }

  deleteComment(id: string) {
    this.store.deleteCommentHandler(id)
  }

}
