import { HttpErrorResponse } from "@angular/common/http";
import { Component, ViewChild, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { cloneDeep } from "lodash";
import { ConfirmationService, Message } from "primeng/api";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { IDuree, Duree } from "src/app/shared/model/duree.model";
import { IMotifDisponibilite, MotifDisponibilite } from "src/app/shared/model/motifDisponibilite.model";
import { IPieceDisponibilite, PieceDisponibilite } from "src/app/shared/model/pieceDisponibilite.model";
import { MotifDisponibiliteService } from "src/app/shared/service/motif-disponibilite.service";
import { PieceDisponibiliteService } from "src/app/shared/service/piece-disponibilite.service";


@Component({
  selector: 'app-creer-modifier-motif-disponibilite',
  templateUrl: './creer-modifier-motif-disponibilite.component.html',
  styleUrls: ['./creer-modifier-motif-disponibilite.component.scss']
})


export class CreerModifierMotifDisponibiliteComponent {



  @ViewChild('dtf') form!: NgForm;
  motifDisponibilite: IMotifDisponibilite = new MotifDisponibilite();
  dure: IDuree = new Duree();
  @Input() data: IMotifDisponibilite = new MotifDisponibilite();
  motifs: IMotifDisponibilite[]=[];
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;
  pieces: IPieceDisponibilite[] = [];
  pieceSelected: PieceDisponibilite[] = [];
    categSelected: any;
  


  constructor(
    private motifService: MotifDisponibiliteService,
    private pieceServiceDisponibilite: PieceDisponibiliteService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
   this.loadPieces();
    if (this.dynamicDialog.data) {
      this.motifDisponibilite = cloneDeep(this.dynamicDialog.data);
      console.warn("MMM",this.motifDisponibilite);
    }
  }


  clear(): void {
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  isEditing() {
    return !!this.motifDisponibilite.id;
  }

  clearDialogMessages() {
    this.dialogErrorMessage = null;
  }

  loadPieces() {
    this.pieceServiceDisponibilite.findListe().subscribe(response => {
        this.pieces = response.body!;
    }, error => {
        this.message = { severity: 'error', summary: error.error };
        console.error(JSON.stringify(error));
    });
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
      this.motifDisponibilite.dureeMax = this.dure;
      //this.motifDisponibilite.typeDemandeur = this.motifDisponibilite.typeDemandeurDto?.libelle;
      console.warn("MOTIF",this.motifDisponibilite);
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    if (this.motifDisponibilite) {
      if (this.motifDisponibilite.id) {
        this.motifService.update(this.motifDisponibilite).subscribe(
          {
            next: (response) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'motifDisponibilite modifié avec succès' });

            },
            error: (error) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

            }
          });
      } else {
        this.motifService.create(this.motifDisponibilite).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.dialogRef.destroy();
            this.showMessage({
              severity: 'success',
              summary: 'motifDisponibilite creer avec succès',
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
