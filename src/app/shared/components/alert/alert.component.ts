import { Component, Input } from '@angular/core';
import { AlertType } from '@models/alert.model';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  // Input variables
  @Input({ alias: "value", required: true }) msg = "";
  @Input({ required: true }) type!: AlertType;

}
