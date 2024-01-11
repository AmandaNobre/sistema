import { Component, Input } from '@angular/core';
import { IButtonsOptional, ICols } from 'form-dynamic-angular';

@Component({
  selector: 'app-table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.css']
})
export class TableCustomComponent {

  @Input() rows: any[] | null = null
  @Input() cols: ICols[] = []
  @Input() buttonsOptional: IButtonsOptional[] = []

  rowsSkeleton: any[] = Array.from({ length: 5 }, (v, k) => k);

}
