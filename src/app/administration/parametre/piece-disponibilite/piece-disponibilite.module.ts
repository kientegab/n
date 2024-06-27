import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PieceDisponibiliteRoutingModule } from './piece-disponibilite-routing.module';

import { DetailsPieceDisponibiliteComponent } from './details-piece-disponibilite/details-piece-disponibilite.component';
import { CreerModifierPieceDisponibiliteComponent } from './creer-modifier-piece-disponibilite/creer-modifier-piece-disponibilite.component';


@NgModule({
  declarations: [
   
    DetailsPieceDisponibiliteComponent,
    CreerModifierPieceDisponibiliteComponent
  ],
  imports: [
    CommonModule,
    PieceDisponibiliteRoutingModule
  ]
})
export class PieceDisponibiliteModule { }
