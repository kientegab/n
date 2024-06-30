import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceDisponibiliteComponent } from './piece-disponibilite.component';
import { DetailsPieceDisponibiliteComponent } from './details-piece-disponibilite/details-piece-disponibilite.component';
import { CreerModifierPieceDisponibiliteComponent } from './creer-modifier-piece-disponibilite/creer-modifier-piece-disponibilite.component';
import { PieceDisponibiliteRoutingModule } from './piece-disponibilite-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { AppCommonModule } from 'src/app/shared/common/app-common.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';




@NgModule({
  declarations: [
    PieceDisponibiliteComponent,
   DetailsPieceDisponibiliteComponent,
    CreerModifierPieceDisponibiliteComponent
  ],
  imports: [
    CommonModule,
    PieceDisponibiliteRoutingModule,
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
    PaginatorModule
  ]
})
export class PieceDisponibiliteModule { }
