import { Component } from '@angular/core';
import {TypeDemande} from "../../../../shared/model/typeDemande.model";
import {Visa} from "../../../../shared/model/visa.model";
import {cloneDeep} from "lodash";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-detail-type-demande',
  templateUrl: './detail-type-demande.component.html',
  styleUrls: ['./detail-type-demande.component.scss']
})
export class DetailTypeDemandeComponent {
    typedemande: TypeDemande = new TypeDemande();
    constructor(
        private dialogRef: DynamicDialogRef,
        private dynamicDialog:  DynamicDialogConfig,
    ) {}
    ngOnInit(): void {
        if (this.dynamicDialog.data) {
            this.typedemande = cloneDeep(this.dynamicDialog.data);
            console.warn("TYPE DEMANDE",this.typedemande);
        }
    }
}
