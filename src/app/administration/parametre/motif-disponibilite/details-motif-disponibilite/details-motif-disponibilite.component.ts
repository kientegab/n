import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IMotifDisponibilite, MotifDisponibilite } from 'src/app/shared/model/motifDisponibilite.model';

@Component({
  selector: 'app-details-motif-disponibilite',
  templateUrl: './details-motif-disponibilite.component.html',
  styleUrls: ['./details-motif-disponibilite.component.scss']
})
export class DetailsMotifDisponibiliteComponent {

  motifDisponibilite: IMotifDisponibilite = new MotifDisponibilite();
  @Input() data: IMotifDisponibilite = new MotifDisponibilite();

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
) {}

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.motifDisponibilite = cloneDeep(this.dynamicDialog.data);
    }
    }

    clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }
}
