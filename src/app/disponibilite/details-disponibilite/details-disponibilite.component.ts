import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { AviserDisponibiliteComponent } from '../aviser-disponibilite/aviser-disponibilite.component';
import { Message } from 'primeng/api';
import { ReceptionDisponibiliteVComponent } from '../reception-disponibilite-v/reception-disponibilite-v.component';

@Component({
  selector: 'app-details-disponibilite',
  templateUrl: './details-disponibilite.component.html',
  styleUrls: ['./details-disponibilite.component.scss']
})
export class DetailsDisponibiliteComponent {

  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  isOpInProgress!: boolean;
  aviser!: boolean;
  receptionner!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  message: any;
  timeoutHandle: any;
  demandes: any;


  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
    private dialogService: DialogService
) {}

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.demande = cloneDeep(this.dynamicDialog.data);
    }
  }

  /** Permet d'afficher un modal pour la reception */
  openModalReceptionner(demande: IDemande): void {
    this.receptionner = true,
    this.dialogService.open(AviserDisponibiliteComponent,
      {
        header: 'Receptionner une demande',
        width: '60%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        closable: true,
        data: demande
      }).onClose.subscribe(result => {
        if(result){
          this.isDialogOpInProgress = false;
          this.showMessage({ severity: 'success', summary: 'Demande receptionnée avec succès' });
        }

      });

  }

  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }
  /** Permet d'afficher un modal pour l'avis */
  openModalAviser(demande: IDemande): void {
    this.aviser = true,
    this.dialogService.open(AviserDisponibiliteComponent,
      {
        header: 'Aviser une demande',
        width: '60%',
        contentStyle: { overflow: 'auto', },
        baseZIndex: 10000,
        maximizable: true,
        closable: true,
        data: demande
      }
    ).onClose.subscribe(result => {
      if(result) {
      this.demandes.push(result);
      this.isDialogOpInProgress = false;
      this.showMessage({ severity: 'success', summary: 'Demande créée avec succès' });
      }
    });
  }


}
