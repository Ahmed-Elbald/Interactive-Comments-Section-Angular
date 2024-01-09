import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { DialogComponent } from '@models/dialog-component.model';
import { fadeInOutAnimation } from '../../../shared/animations/app.animations';

@Component({
  selector: 'app-delete-comment-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-comment-dialog.component.html',
  styleUrl: './delete-comment-dialog.component.scss',
  animations: [fadeInOutAnimation()]
})
export class DeleteCommentDialogComponent implements DialogComponent, AfterViewInit {

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
