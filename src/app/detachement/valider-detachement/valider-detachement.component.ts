import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { IHistorique, Historique, RECEPTIONS } from 'src/app/shared/model/historique.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-valider-detachement',
  templateUrl: './valider-detachement.component.html',
  styleUrls: ['./valider-detachement.component.scss']
})
export class ValiderDetachementComponent {
  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  isDialogOpInProgress: boolean | undefined;
  isOpInProgress: boolean | undefined;
  isLoggedIn = false;
  profil!: string;
  dialogErrorMessage: any;
  message: any;
  timeoutHandle: any;
  historique:IHistorique = new Historique();

  
 
  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
    private demandeService: DemandeService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenService.getUser();
      this.profil = user.profil;
    }

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
  
  rejetterDemande(): void {
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    if (this.demande) {
      if (this.demande.id) {
        console.log("historique ===========", this.historique);
        this.demande.historique=this.historique;

        if(this.profil === "SG") {
          this.demandeService.rejeterSG(this.demande).subscribe(
            {
              next: (response: any) => {
                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'Demande rejettée avec succès pour modification' });
              
              },
              error: (error: { error: { message: any; }; }) => {
                console.error("error" + JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });
              }
            }
          );
        }

        if(this.profil === "DRH") {
          this.demandeService.rejeterDRH(this.demande).subscribe(
            {
              next: (response: any) => {
                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'Demande rejettée avec succès pour modification' });
              
              },
              error: (error: { error: { message: any; }; }) => {
                console.error("error" + JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });
              }
            }
          );
        }

       
      }
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
