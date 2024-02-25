import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { DialogComponent } from '@models/dialog-component.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  // private fields
  private _container!: ViewContainerRef;
  private componentRef: ComponentRef<DialogComponent> | null = null;

  // Public methods
  open(compType: Type<DialogComponent>, inputs?: { [key: string]: any }): Observable<boolean> {
    if (!this._container)
      return EMPTY

    this.componentRef = this._container.createComponent(compType);
    if (inputs)
      Object.entries(inputs).forEach(([key, value]) => this.componentRef?.setInput(key, value));

    return this.componentRef.instance.onSubmit.asObservable();
  }

  close() {
    this._container.clear();
    this.componentRef = null;
  }

  // Setters
  set container(container: ViewContainerRef) {
    this._container = container;
  }
}
