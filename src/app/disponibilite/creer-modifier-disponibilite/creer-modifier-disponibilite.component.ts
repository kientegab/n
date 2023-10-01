import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Demande, IDemande, TypeDemandeur } from 'src/app/shared/model/demande.model';
import { IMotif } from 'src/app/shared/model/motif.model';
import { IPiece } from 'src/app/shared/model/piece.model';

import { IPieceJointe } from 'src/app/shared/model/pieceJointe.model';
import { ITypeDemande } from 'src/app/shared/model/typeDemande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { MotifService } from 'src/app/shared/service/motif.service';
import { TypeDemandeService } from 'src/app/shared/service/type-demande.service';

@Component({
  selector: 'app-creer-modifier-disponibilite',
  templateUrl: './creer-modifier-disponibilite.component.html',
  styleUrls: ['./creer-modifier-disponibilite.component.scss']
})
export class CreerModifierDisponibiliteComponent {
  
  //////////////////////////////////////////// @ViewChild('dtf') form!: NgForm;
  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  demandes: IDemande[]=[];
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;
  typeDemandes: ITypeDemande[]=[];
  pieces: IPiece[] = [];
  file: Blob | string = '';
  selectedFile: File | null = null;
  motifs: IMotif[] = [];
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
selectedMotif: IMotif | undefined;
selectedPieces: IPiece[] = [];

multiple=true;

uploadedFiles: any[] = [];
  motifWithPieces: any;





onTypeDemandeChange() {
  // Réinitialisez la liste des motifs en fonction du type de demande sélectionné
  if (this.demande.typeDemande && this.demande.typeDemande.motifDTOs) {
    this.motifs = this.demande.typeDemande.motifDTOs;
    this.selectedMotif = undefined; // Réinitialisez la sélection du motif
  } else {
    this.motifs = []; // Si le type de demande n'a pas de motifs, réinitialisez la liste
    this.selectedMotif = undefined; // Réinitialisez la sélection du motif
  }
}

onUpload($event: any) {

}

getUploadUrl(pieceId: | undefined): string {
  if (pieceId !== undefined) {
    // Ici, vous pouvez générer l'URL d'envoi de fichiers en utilisant pieceId
    return `votre-url-d-envoi-de-fichiers/${pieceId}`;
  } else {
    // Gérer le cas où pieceId est undefined, par exemple, en renvoyant une URL par défaut ou une chaîne vide
    return 'votre-url-d-envoi-de-fichiers-par-defaut';
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
onMotifChange() {
  // Vous pouvez obtenir le motif sélectionné à partir de this.selectedMotif
  // Recherchez le motif dans motifsWithPieces et mettez à jour selectedPieces en conséquence
  const selectedMotif = this.selectedMotif?.libelle; // Assurez-vous que selectedMotif correspond à ce que vous stockez dans motifsWithPieces

  // Assurez-vous que selectedMotif est défini avant de l'utiliser
  if (selectedMotif) {
    // Recherchez le motif dans motifsWithPieces
    const motifWithPieces = this.motifWithPieces.find((m: { motif: string; }) => m.motif === selectedMotif);

    if (motifWithPieces) {
      this.selectedPieces = motifWithPieces.pieces;
    } else {
      this.selectedPieces = []; // Aucun motif sélectionné ou motif non trouvé, réinitialisez la liste des pièces
    }
  } else {
    this.selectedPieces = []; // Si selectedMotif n'est pas défini, réinitialisez la liste des pièces
  }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  onFileChange(event: any, pieceJointe: string) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      // Vous pouvez stocker le fichier sélectionné dans le modèle
      // this[pieceJointe].fichier = fileList[0];
    }
  }


  onSelectFile(event: any): void {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }


  constructor(
    private demandeService: DemandeService,
    private dialogRef: DynamicDialogRef,
    private typeDemandeService: TypeDemandeService,
    private motifService: MotifService,
    // private dynamicDialog: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
   
    // if (this.dynamicDialog.data) {
    //   this.demande = cloneDeep(this.dynamicDialog.data);
    // }
    this.loadTypeDemande();
   this.loadMotif('');
  }

  typeDemandeur: SelectItem[] = [
    { label: 'Agent', value: TypeDemandeur.Agent },
    { label: 'Structure', value: TypeDemandeur.Structure },
  ];
  
  displayCalendar = false;

  openCalendar() {
    this.displayCalendar = true;
  }

  loadTypeDemande() {
    this.typeDemandeService.findAll().subscribe(response => {

      this.typeDemandes = response.body!;
      console.warn("================",this.typeDemandes)
    }, error => {
      this.message = { severity: 'error', summary: error.error };
      console.error(JSON.stringify(error));
    });
  }


  loadMotif(typeDemande:string) {
    this.motifService.findAll().subscribe(response => {

      this.motifs = response.body!;
    }, error => {
      this.message = { severity: 'error', summary: error.error };
      console.error(JSON.stringify(error));
    });
  }

  

 
  clear(): void {
    // this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  isEditing() {
    return !!this.demande.id;
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
    if (this.demande) {
      if (this.demande.id) {
        this.demandeService.update(this.demande).subscribe(
          {
            next: (response) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'demande modifié avec succès' });
             
            },
            error: (error) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

            }
          });
      } else {
        this.demandeService.create(this.demande).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.dialogRef.destroy();
            this.showMessage({
              severity: 'success',
              summary: 'demande creer avec succès',
            });
          },
          error: (error) => {
            console.error("error" + JSON.stringify(error));
            this.isOpInProgress = false;
            this.showMessage({ severity: 'error', summary: error.error.message });

          }
        });
      }
    }
  }

}
