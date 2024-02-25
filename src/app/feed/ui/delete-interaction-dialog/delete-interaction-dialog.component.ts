import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { DialogComponent } from '@models/dialog-component.model';
import { fadeInOutAnimation } from '../../../shared/animations/app.animations';
import { InteractionFormPurpose } from '../../utils/models/interaction-form.model';

@Component({
  selector: 'app-delete-interaction-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-interaction-dialog.component.html',
  styleUrl: './delete-interaction-dialog.component.scss',
  animations: [fadeInOutAnimation()]
})
export class DeleteInteractionDialogComponent implements DialogComponent, AfterViewInit {

  // Input Variables
  @Input() interactionType: InteractionFormPurpose = "comment";

  // View Children
  @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>

  // Public fields
  public onSubmit: Subject<boolean> = new Subject<boolean>();

  // Public methods
  ngAfterViewInit(): void {
    this.dialog.nativeElement.showModal();
  }

  submit(value: boolean) {
    this.dialog.nativeElement.close();
    this.onSubmit.next(value)
  }
}
