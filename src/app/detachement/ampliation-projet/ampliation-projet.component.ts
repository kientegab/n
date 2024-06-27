import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ConfirmationService, Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AmpliationDemande, IAmpliationDemande } from 'src/app/shared/model/ampliationDemande.model';
import { Demande, IDemande } from 'src/app/shared/model/demande.model';
import { AmpliationProjetService } from 'src/app/shared/service/ampliation-projet.service';
// import { IAmpliationDemande, Ampliation } from 'src/app/shared/model/ampliation.model';
//import { AmpliationProjetService } from 'src/app/shared/service/ampliation-service.service';

@Component({
  selector: 'app-ampliation-projet',
  templateUrl: './ampliation-projet.component.html',
  styleUrls: ['./ampliation-projet.component.scss']
})
export class AmpliationProjetComponent {

  @ViewChild('dtf') form!: NgForm;
  ampliationDemande: IAmpliationDemande = new AmpliationDemande();
  @Input() data: IAmpliationDemande = new AmpliationDemande();
  ampliations: IAmpliationDemande[]=[];
  demande: IDemande = new Demande();
  demandes: IDemande[] = [];
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;

  constructor(
    private ampliationProjetService: AmpliationProjetService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
   
    if (this.dynamicDialog.data) {

      console.log("=========================Test=====================",this.dynamicDialog.data)
      this.ampliationDemande = cloneDeep(this.dynamicDialog.data);

     // this.ampliation = cloneDeep(this.dynamicDialog.data);

      // this.demandes.push(this.demande);
    }
  }


  clear(): void {
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  isEditing() {
    return !!this.ampliationDemande.id;
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

    console.log("ID de l'ampliation :", this.ampliationDemande.id);

    if (this.ampliationDemande && this.ampliationDemande.id) {
        console.log("Mise à jour d'ampliation");

        console.log("ampliation à envoyer", this.ampliationDemande);

        this.ampliationProjetService.update(this.ampliationDemande).subscribe({
            next: (response) => {
                console.log("Réponse de mise à jour :", response);

                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'ampliation modifié avec succès' });
            },
            error: (error) => {
                console.error("Erreur de mise à jour :", JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });
            }
        });
    } else {
        console.log("Création d'ampliation");

    //    this.ampliationDemande.demande = this.demande;
        console.log("ampliation à envoyer", this.ampliationDemande);

        this.ampliationProjetService.create(this.ampliationDemande).subscribe({
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




    // saveEntity(): void {
    //   this.clearDialogMessages();
    //   this.isDialogOpInProgress = true;
    //   if (this.ampliation) {
    //     if (this.ampliation.id) {
    //       this.ampliationService.update(this.ampliation).subscribe(
    //         {
    //           next: (response) => {
    //             this.dialogRef.close(response);
    //             this.dialogRef.destroy();
    //             this.showMessage({ severity: 'success', summary: 'ampliation modifié avec succès' });
               
    //           },
    //           error: (error) => {
    //             console.error("error" + JSON.stringify(error));
    //             this.isOpInProgress = false;
    //             this.showMessage({ severity: 'error', summary: error.error.message });
  
    //           }
    //         });
    //     } else {
    //       this.ampliationService.create(this.ampliation).subscribe({
    //         next: (response) => {
    //           this.dialogRef.close(response);
    //           this.dialogRef.destroy();
    //           this.showMessage({
    //             severity: 'success',
    //             summary: 'ampliation creer avec succès',
    //           });
    //         },
    //         error: (error) => {
    //           console.error("error" + JSON.stringify(error));
    //           this.isOpInProgress = false;
    //           this.showMessage({ severity: 'error', summary: error.error.message });
  
    //         }
    //       });
    //     }
    //   }
    // }







    
}
