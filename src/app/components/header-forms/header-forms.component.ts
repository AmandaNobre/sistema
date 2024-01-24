import { Component, Input } from '@angular/core';
import { IButtonsOptional, IButtonsStandard } from 'form-dynamic-angular';

@Component({
  selector: 'app-header-forms',
  templateUrl: './header-forms.component.html',
  styleUrls: ['./header-forms.component.css']
})
export class HeaderFormsComponent {
  @Input() buttonsStandard!: IButtonsStandard[]
  @Input() buttonsOptional!: IButtonsOptional[]
  @Input() title!: string
}
