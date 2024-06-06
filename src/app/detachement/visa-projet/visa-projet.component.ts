import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CreerModifierVisaComponent } from 'src/app/administration/parametre/visa/creer-modifier-visa/creer-modifier-visa.component';
import { DetailsvisaComponent } from 'src/app/administration/parametre/visa/details-visa/details-visa.component';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { IVisaDemande, VisaDemande } from 'src/app/shared/model/visaDemande.model';
import { VisaProjetService } from 'src/app/shared/service/visa-projet.service';
//import { visaProjetService } from 'src/app/shared/service/visa-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-visa-projet',
  templateUrl: './visa-projet.component.html',
  styleUrls: ['./visa-projet.component.scss']
})
export class VisaProjetComponent {
 
  @ViewChild('dtf') form!: NgForm;
  visaDemande: IVisaDemande = new VisaDemande();
  @Input() data: IVisaDemande = new VisaDemande();

  demande: IDemande = new Demande();
  demandes: IDemande[] = [];
  // visas: IVisaDemande[]=[];
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;

  constructor(
    private visaProjetService: VisaProjetService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
   
    if (this.dynamicDialog.data) {
      this.visaDemande = cloneDeep(this.dynamicDialog.data);
      // this.demandes.push(this.demande);
    }
  }


  clear(): void {
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  isEditing() {
    return !!this.visaDemande.id;
  }

  clearDialogMessages() {
    this.dialogErrorMessage = null;
  }
  // Errors
  handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
  }

  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  saveEntity(): void {
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;

    console.log("ID du visa :", this.visaDemande.id);

    if (this.visaDemande && this.visaDemande.id) {
        console.log("Mise à jour de la demande");

        console.log("demande à envoyer", this.visaDemande);

        this.visaProjetService.update(this.visaDemande).subscribe({
            next: (response) => {
                console.log("Réponse de mise à jour :", response);

                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'visa modifié avec succès' });
            },
            error: (error) => {
                console.error("Erreur de mise à jour :", JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });
            }
        });
    } else {
        console.log("Création de visa");

    //    this.ampliationDemande.demande = this.demande;
        console.log("visa à envoyer", this.visaDemande);

        this.visaProjetService.create(this.visaDemande).subscribe({
            next: (response) => {
                console.log("Réponse de création :", response);

                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'visa creer avec succès' });
            },
            error: (error) => {
                console.error("Erreur de création :", JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });
            }
        });
    }
}

  

  }



