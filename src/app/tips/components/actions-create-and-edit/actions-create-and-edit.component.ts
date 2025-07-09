import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Action} from "../../model/action.entity";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-actions-create-and-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TranslateModule
  ],
  templateUrl: './actions-create-and-edit.component.html',
  styleUrl: './actions-create-and-edit.component.css'
})
export class ActionsCreateAndEditComponent {
  @Output() save = new EventEmitter<Action>();
  @Output() close = new EventEmitter<void>();

  @Input() action: Action = new Action({ id: 0, title: '', description: '', type: '', favorite: false });

  submitForm() {
    const actionToSave = new Action(this.action);
    if (actionToSave.title && actionToSave.description && actionToSave.type) {
      this.save.emit(actionToSave);
    }
  }

  onCloseClick() {
    this.close.emit();
  }
}
