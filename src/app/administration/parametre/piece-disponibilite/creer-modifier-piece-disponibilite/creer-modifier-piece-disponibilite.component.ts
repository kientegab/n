import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IMotifDisponibilite } from 'src/app/shared/model/motifDisponibilite.model';
import { IPieceDisponibilite, PieceDisponibilite } from 'src/app/shared/model/pieceDisponibilite.model';
import { MotifDisponibiliteService } from 'src/app/shared/service/motif-disponibilite.service';
import { PieceDisponibiliteService } from 'src/app/shared/service/piece-disponibilite.service';

@Component({
  selector: 'app-creer-modifier-piece-disponibilite',
  templateUrl: './creer-modifier-piece-disponibilite.component.html',
  styleUrls: ['./creer-modifier-piece-disponibilite.component.scss']
})
export class CreerModifierPieceDisponibiliteComponent {
  @ViewChild('dtf') form!: NgForm;
  pieceDisponibilite: IPieceDisponibilite = new PieceDisponibilite();
  @Input() data: IPieceDisponibilite = new PieceDisponibilite();
  motifDisponibilites: IMotifDisponibilite[] = [];
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;

  constructor(
    private pieceService: PieceDisponibiliteService,
    private motifService: MotifDisponibiliteService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.pieceDisponibilite = cloneDeep(this.dynamicDialog.data);
    }
    this.loadMotifs();
  }

  loadMotifs() {
    this.motifService.findListe().subscribe(response => {
        this.motifDisponibilites = response.body!;
    }, error => {
        this.message = { severity: 'error', summary: error.error };
        console.error(JSON.stringify(error));
    });
}

  clear(): void {
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  isEditing() {
    return !!this.pieceDisponibilite.id;
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
    if (this.pieceDisponibilite) {
      console.log("piece to save ==========", this.pieceDisponibilite);
      if (this.pieceDisponibilite.id) {
        this.pieceService.update(this.pieceDisponibilite).subscribe(
          {
            next: (response) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'piece modifié avec succès' });
             
            },
            error: (error) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

            }
          });
      } else {
        this.pieceService.create(this.pieceDisponibilite).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.dialogRef.destroy();
            this.showMessage({
              severity: 'success',
              summary: 'piece creer avec succès',
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

