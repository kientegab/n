import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IPieceDisponibilite, PieceDisponibilite } from 'src/app/shared/model/pieceDisponibilite.model';

@Component({
  selector: 'app-details-piece-disponibilite',
  templateUrl: './details-piece-disponibilite.component.html',
  styleUrls: ['./details-piece-disponibilite.component.scss']
})
export class DetailsPieceDisponibiliteComponent {
  pieceDisponibilite: IPieceDisponibilite = new PieceDisponibilite();
  @Input() data: IPieceDisponibilite = new PieceDisponibilite();

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
) {}

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.pieceDisponibilite = cloneDeep(this.dynamicDialog.data);
    }
    }

    clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }

}

