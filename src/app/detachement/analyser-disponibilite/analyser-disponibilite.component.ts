import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Demande, IDemande } from 'src/app/shared/model/demande.model';
import { AVIS, Historique, IHistorique, RECEPTIONS } from 'src/app/shared/model/historique.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-analyser-disponibilite',
  templateUrl: './analyser-disponibilite.component.html',
  styleUrls: ['./analyser-disponibilite.component.scss']
})
export class AnalyserDisponibiliteComponent {
  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  isDialogOpInProgress: boolean | undefined;
  isOpInProgress: boolean | undefined;
  dialogErrorMessage: any;
  message: any;
  timeoutHandle: any;
  historique:IHistorique = new Historique();
  receptions = RECEPTIONS;
  
 

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
    private demandeService: DemandeService
  ) {}

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.demande = cloneDeep(this.dynamicDialog.data);
    }
  }
    
  clear(): void {
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
 
  // Errors
  handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
  }
  
  analyserDemande(): void {
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    if (this.demande) {
        console.log("histo ===========", this.historique);
        this.demande.historique=this.historique;
        this.demandeService.analyserCA(this.demande).subscribe(
          {
            next: (response: any) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'Demande Analysée avec succès' });
             
            },
            error: (error: { error: { message: any; }; }) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

            }
          });
     
    }
  }
  
  clearDialogMessages() {
    this.dialogErrorMessage = null;
  }

  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

}