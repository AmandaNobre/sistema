import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppheaderComponent } from './appheader/appheader.component';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { ControlSideBarComponent } from './control-side-bar/control-side-bar.component';
import { TableCustomComponent } from './table-custom/table-custom.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [
    AppheaderComponent,
    AppMenuComponent,
    ControlSideBarComponent,
    TableCustomComponent
  ],
  imports: [
    MessagesModule,
    TooltipModule,
    PaginatorModule,
    SkeletonModule,
    ButtonModule,
    TableModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' }),
  ],
  exports: [
    AppheaderComponent,
    AppMenuComponent,
    ControlSideBarComponent,
    TableCustomComponent
  ]
})

export class ComponentsModule { }