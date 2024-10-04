import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisponibiliteRoutingModule } from './disponibilite-routing.module';
import { DisponibiliteComponent } from './disponibilite.component';
import { CreerModifierDisponibiliteComponent } from './creer-modifier-disponibilite/creer-modifier-disponibilite.component';
import { DetailsDisponibiliteComponent } from './details-disponibilite/details-disponibilite.component';
import { AviserDisponibiliteComponent } from './aviser-disponibilite/aviser-disponibilite.component';
import { DisponibiliteAgentsComponent } from './disponibilite-agents/disponibilite-agents.component';
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
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AppCommonModule } from '../shared/common/app-common.module';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { ReceptionDisponibiliteComponent } from './reception-disponibilite/reception-disponibilite.component';
import {FieldsetModule} from "primeng/fieldset";
import { ReceptionDisponibiliteVComponent } from './reception-disponibilite-v/reception-disponibilite-v.component';
import { DetailsDisponibiliteAgentComponent } from './details-disponibilite-agent/details-disponibilite-agent.component';
import { DocumentUploadFileComponent } from './document-upload-file/document-upload-file.component';





@NgModule({
  declarations: [
    DisponibiliteComponent,
    CreerModifierDisponibiliteComponent,
    DetailsDisponibiliteComponent,
    AviserDisponibiliteComponent,
    DisponibiliteAgentsComponent,
    ReceptionDisponibiliteComponent,
    ReceptionDisponibiliteVComponent,
    DetailsDisponibiliteAgentComponent,
    DocumentUploadFileComponent
  ],
    imports: [
        CommonModule,
        DisponibiliteRoutingModule,
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
        CalendarModule,

        MultiSelectModule,


        FileUploadModule,
        FieldsetModule

    ]
})
export class DisponibiliteModule { }
