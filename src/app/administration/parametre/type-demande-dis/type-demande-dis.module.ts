import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeDemandeDisRoutingModule } from './type-demande-dis-routing.module';

import { CreerModifierTdemandeDisComponent } from './creer-modifier-tdemande-dis/creer-modifier-tdemande-dis.component';
import { DetailTdemandeDisComponent } from './detail-tdemande-dis/detail-tdemande-dis.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AppCommonModule } from 'src/app/shared/common/app-common.module';
import { TypeDemandeDisComponent } from './type-demande-dis.component';


@NgModule({
  declarations: [
    TypeDemandeDisComponent,
    CreerModifierTdemandeDisComponent,
    DetailTdemandeDisComponent
  ],
  imports: [
    CommonModule,
    TypeDemandeDisRoutingModule,
    AppCommonModule,
    ButtonModule,
    CardModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    SharedModule,
    TableModule,
    DropdownModule,
    ProgressBarModule,
    MultiSelectModule,
    FieldsetModule
  ]
})
export class TypeDemandeDisModule { }
