import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivationCompteRoutingModule } from './activation-compte-routing.module';
import { ActivationCompteComponent } from './activation-compte.component';


@NgModule({
  declarations: [
    ActivationCompteComponent
  ],
  imports: [
    CommonModule,
    ActivationCompteRoutingModule
  ]
})
export class ActivationCompteModule { }
