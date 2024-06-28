import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotifDisponibiliteRoutingModule } from './motif-disponibilite-routing.module';
import { MotifDisponibiliteComponent } from './motif-disponibilite.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AppCommonModule } from 'src/app/shared/common/app-common.module';
import { MotifRoutingModule } from '../motif/motif-routing.module';
import { CreerModifierMotifDisponibiliteComponent } from './creer-modifier-motif-disponibilite/creer-modifier-motif-disponibilite.component';
import { DetailsMotifDisponibiliteComponent } from './details-motif-disponibilite/details-motif-disponibilite.component';


@NgModule({
  declarations: [
    MotifDisponibiliteComponent,
    CreerModifierMotifDisponibiliteComponent,
    DetailsMotifDisponibiliteComponent  ],
  imports: [
    CommonModule,
    MotifDisponibiliteRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DynamicDialogModule,
    TableModule,
    CardModule,
    InputTextModule,
    DialogModule,
    DividerModule,
    ProgressBarModule,
    MessageModule,
    DropdownModule,
    AppCommonModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    PaginatorModule,
    MultiSelectModule
  ]
})
export class MotifDisponibiliteModule { }
