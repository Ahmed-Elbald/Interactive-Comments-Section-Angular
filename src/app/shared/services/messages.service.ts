import { Injectable } from '@angular/core';
import { AlertMessage, AlertType } from '@models/alert.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  // Emitters
  public appMessage$ = new Subject<AlertMessage | null>();

  // Private fields
  private intervalRef: any | null = null;

  // Public methods
  addMsg(value: string, type: AlertType = "error") {
    this.appMessage$.next(null);
    if (this.intervalRef) clearTimeout(this.intervalRef);

    setTimeout(() => this.appMessage$.next({ value, type }), 0)

    this.intervalRef = setTimeout(() => {
      this.appMessage$.next(null)
    }, 5000);

  }

}
