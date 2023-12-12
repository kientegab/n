import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ConfirmationService, Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Demande, IDemande } from 'src/app/shared/model/demande.model';
import { AVIS, Historique, IHistorique, RECEPTIONS } from 'src/app/shared/model/historique.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-verifier-projet',
  templateUrl: './verifier-projet.component.html',
  styleUrls: ['./verifier-projet.component.scss']
})
export class VerifierProjetComponent {


  
  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  demandes: any;
  isDialogOpInProgress: boolean | undefined;
  isOpInProgress: boolean | undefined;
  dialogErrorMessage: any;
  typeDemandeService: any;
  typeDemandes: any;

  avis = AVIS;
  receptions = RECEPTIONS;
  commentaire: string | undefined;
  historique:IHistorique = new Historique();
  historiques: IHistorique[] = []; 
  isLoggedIn = false;
  profil!: string;
 
  message: any;
  timeoutHandle: any;
  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
    private demandeService:DemandeService

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
  

  // receptions: SelectItem[] = [
  //   { label: 'conforme ', value: receptions.reception1 },
  //   { label: 'Non conforme', value: receptions.reception2 },
  // ];
 
  // Errors
  handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
  }
  
  saveVerfierProjet(): void {
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    if (this.demande) {
        this.demande.historique=this.historique;
        
        this.demandeService.verifierProjetSTDCMEF(this.demande).subscribe(
          {
            next: (response: any) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'Projet vérifié avec succès' });
             
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
  
  loadTypeDemande() {
    this.typeDemandeService.findAll().subscribe((response: { body: any; }) => {

      this.typeDemandes = response.body!;
    }, (error: { error: any; }) => {
      this.message = { severity: 'error', summary: error.error };
      console.error(JSON.stringify(error));
    });
  }
  

}
