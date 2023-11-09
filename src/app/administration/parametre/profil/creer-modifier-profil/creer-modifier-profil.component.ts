import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IMotif } from 'src/app/shared/model/motif.model';
import { IProfil, Profil } from 'src/app/shared/model/profil.model';
import { MotifService } from 'src/app/shared/service/motif.service';
import { ProfilService } from 'src/app/shared/service/profil.service';

@Component({
  selector: 'app-creer-modifier-profil',
  templateUrl: './creer-modifier-profil.component.html',
  styleUrls: ['./creer-modifier-profil.component.scss']
})
export class CreerModifierProfilComponent {

  @ViewChild('dtf') form!: NgForm;
  profil: IProfil = new Profil();
  @Input() data: IProfil = new Profil();
  motifs: IMotif[] = [];
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;

  constructor(
    private profilService: ProfilService,
    private motifService: MotifService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.profil = cloneDeep(this.dynamicDialog.data);
    }
    // this.loadMotifs();
  }

//   loadMotifs() {
//     this.motifService.findListe().subscribe(response => {
//         this.motifs = response.body!;
//     }, error => {
//         this.message = { severity: 'error', summary: error.error };
//         console.error(JSON.stringify(error));
//     });
// }

  clear(): void {
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }

  isEditing() {
    return !!this.profil.id;
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
    if (this.profil) {
      console.log("profil to save ==========", this.profil);
      if (this.profil.id) {
        this.profilService.update(this.profil).subscribe(
          {
            next: (response) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'profil modifié avec succès' });
             
            },
            error: (error) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

            }
          });
      } else {
        this.profilService.create(this.profil).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.dialogRef.destroy();
            this.showMessage({
              severity: 'success',
              summary: 'profil créé avec succès',
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
