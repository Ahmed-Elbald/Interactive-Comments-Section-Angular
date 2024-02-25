import { AfterViewInit, Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThreadComponent } from './feed/feature/thread/thread.component';
import { MessagesService } from './shared/services/messages.service';
import { AlertComponent } from './shared/components/alert/alert.component';
import { DialogService } from './shared/services/dialog.service';
import { childFadeInOut } from './shared/animations/app.animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ThreadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [childFadeInOut]
})
export class AppComponent implements AfterViewInit {

  // Deps
  private messagesService = inject(MessagesService);
  private dialog = inject(DialogService);

  // View Children
  @ViewChild("dialogsContainer", { read: ViewContainerRef }) dialogsContainer!: ViewContainerRef;

  // Public fields
  public AlertComponent = AlertComponent;
  public appMessage$ = this.messagesService.appMessage$;

  // Public methods
  ngAfterViewInit(): void {
    this.dialog.container = this.dialogsContainer;
  }


}