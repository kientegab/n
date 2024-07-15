import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { AdministrationModule } from '../administration/administration.module';
import { PasswordModule } from 'primeng/password';
import { ActivationCompteComponent } from './activation-compte/activation-compte.component';


@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DividerModule,
    FormsModule,
    MessagesModule,
    AdministrationModule,
    ButtonModule,
    AccountRoutingModule,
    PasswordModule
  ]
})
export class AccountModule { }
