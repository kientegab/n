import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NouveauAgentRoutingModule } from './nouveau-agent-routing.module';
import { CreerModifierAgentComponent } from './creer-modifier-agent/creer-modifier-agent.component';
import { DetailsAgentComponent } from './details-agent/details-agent.component';
import { NouveauAgentComponent } from './nouveau-agent.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AppCommonModule } from 'src/app/shared/common/app-common.module';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [
    NouveauAgentComponent,
    CreerModifierAgentComponent,
    DetailsAgentComponent
  ],
  imports: [
    CommonModule,
    NouveauAgentRoutingModule,
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
    PasswordModule,
    CheckboxModule
    
  ]
})
export class NouveauAgentModule { }
