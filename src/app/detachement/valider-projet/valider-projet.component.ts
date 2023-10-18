import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { IHistorique, Historique, AVIS, RECEPTIONS } from 'src/app/shared/model/historique.model';

@Component({
  selector: 'app-valider-projet',
  templateUrl: './valider-projet.component.html',
  styleUrls: ['./valider-projet.component.scss']
})
export class ValiderProjetComponent {

  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  demandes: any;
  isDialogOpInProgress: boolean | undefined;
  demandeService: any;
  isOpInProgress: boolean | undefined;
  dialogErrorMessage: any;
  typeDemandeService: any;
  typeDemandes: any;
  message: { severity: string; summary: any; } | undefined;
  avis = AVIS;
  receptions = RECEPTIONS;
  commentaire: string | undefined;
  historique:IHistorique = new Historique();
  historiques: IHistorique[] = []; 
  
 

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
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
  
  saveValiderProjet(): void {
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    if (this.demande) {
        this.demande.historique=this.historique;
        this.demandeService.update(this.demande).subscribe(
          {
            next: (response: any) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'Projet validé avec succès' });
             
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
    throw new Error('Method not implemented.');
  }

  showMessage(arg0: { severity: string; summary: string; }) {
    throw new Error('Method not implemented.');
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
