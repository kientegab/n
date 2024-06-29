import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotifDisponibiliteRoutingModule } from './motif-disponibilite-routing.module';
import { MotifDisponibiliteComponent } from './motif-disponibilite.component';


@NgModule({
  declarations: [
    MotifDisponibiliteComponent
  ],
  imports: [
    CommonModule,
    MotifDisponibiliteRoutingModule
  ]
})
export class MotifDisponibiliteModule { }
