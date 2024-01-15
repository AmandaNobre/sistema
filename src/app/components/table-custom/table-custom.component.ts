import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { IButtonsOptional, ICols } from 'form-dynamic-angular';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.css']
})
export class TableCustomComponent implements OnInit, OnChanges {

  ngOnInit(): void {
    this.onPageChange({
      page: 0,
      first: 0,
      pageCount: 1,
      rows: 10
    })
  }

  @Input() rows: any[] | null = null
  @Input() cols: ICols[] = []
  @Input() buttonsOptional: IButtonsOptional[] = []

  rowsPagination: any[] = []
  rowsSkeleton: any[] = Array.from({ length: 5 }, (v, k) => k);
  first: number = 0;
  rowsPaginator: number = 10;

  onPageChange(event: PageEvent) {
    console.log('this.rows', this.rows)
    if (this.rows) {
      this.rowsPagination = this.rows.slice(event.page * event.rows, event.page * event.rows + event.rows)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onPageChange({
      page: 0,
      first: 0,
      pageCount: 1,
      rows: 10
    })
  }

}
