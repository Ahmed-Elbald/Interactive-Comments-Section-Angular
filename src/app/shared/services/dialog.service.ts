import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { DialogComponent } from '@models/dialog-component.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  // private fields
  private container!: ViewContainerRef;
  private componentRef: ComponentRef<DialogComponent> | null = null;

  // Public methods
  open(compType: Type<DialogComponent>): Observable<boolean> {
    if (!this.container)
      return EMPTY

    this.componentRef = this.container.createComponent(compType);
    return this.componentRef.instance.onSubmit.asObservable();
  }

  close() {
    this.container.clear();
    this.componentRef = null;
  }

  // Setters
  set dialogContainer(container: ViewContainerRef) {
    this.container = container;
  }
}
