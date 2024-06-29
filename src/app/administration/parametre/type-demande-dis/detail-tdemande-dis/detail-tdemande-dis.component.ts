import { Component } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TypeDemande } from 'src/app/shared/model/typeDemande.model';

@Component({
  selector: 'app-detail-tdemande-dis',
  templateUrl: './detail-tdemande-dis.component.html',
  styleUrls: ['./detail-tdemande-dis.component.scss']
})
export class DetailTdemandeDisComponent {
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
