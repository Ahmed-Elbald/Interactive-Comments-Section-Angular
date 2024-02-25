import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LetDirective } from '@ngrx/component';

import { InteractionComponent } from '../../ui/interaction/interaction.component';
import { ThreadStore } from '../../data-access/thread.store';
import { InteractionFormComponent } from '../../ui/interaction-form/interaction-form.component';
import { InteractionFormData } from '../../utils/models/interaction-form.model';
import { VotingData } from '../../utils/models/voting-data.model';
import { fadeInOutAnimation } from '../../../shared/animations/app.animations';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [InteractionComponent, InteractionFormComponent, AsyncPipe, LetDirective],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
  providers: [ThreadStore],
  animations: [fadeInOutAnimation()]
})
export class ThreadComponent implements OnInit {

  // Deps
  private store = inject(ThreadStore);

  // Public fields
  public currentUser$ = this.store.currentUser$;
  public interactions$ = this.store.interactions$;

  // Public methods
  ngOnInit(): void {
    this.store.init();
  }

  submitInteractionForm(formData: InteractionFormData) {
    this.store.submitInteractionForm(formData)
  }

  changeInteractionScore(votingData: VotingData) {
    this.store.changeScoreHanlder(votingData as Required<VotingData>)
  }

  deleteInteraction(id: string) {
    this.store.deleteInteractionHandler(id)
  }

}
