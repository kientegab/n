import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ConfirmationService, Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Ampliation } from 'src/app/shared/model/ampliation.model';
import { Article } from 'src/app/shared/model/article.model';
import { Motif } from 'src/app/shared/model/motif.model';
import { Piece } from 'src/app/shared/model/piece.model';
import { ITypeDemande, TypeDemande } from 'src/app/shared/model/typeDemande.model';
import { Visa } from 'src/app/shared/model/visa.model';
import { AmpliationService } from 'src/app/shared/service/ampliation-service.service';
import { ArticleService } from 'src/app/shared/service/article.service';
import { MotifService } from 'src/app/shared/service/motif.service';
import { TypeDemandeService } from 'src/app/shared/service/type-demande.service';
import { VisaService } from 'src/app/shared/service/visa-service';

@Component({
  selector: 'app-creer-modifier-tdemande-dis',
  templateUrl: './creer-modifier-tdemande-dis.component.html',
  styleUrls: ['./creer-modifier-tdemande-dis.component.scss']
})
export class CreerModifierTdemandeDisComponent {
  @ViewChild('dtf') form!: NgForm;
  typeDemande: ITypeDemande = new TypeDemande();
  @Input() data: ITypeDemande = new TypeDemande();
  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;

  motifs: Motif[] = [];
  articles: Article[] = [];
  visas: Visa[] = [];
  pieces: Piece[] = [];
  ampliations: Ampliation[] = [];
  ampliationsSelected: Ampliation[] = [];
  piecesSelected: Piece[] = [];
  visasSelected: Visa[] = [];
  articlesSelected: Article[] = [];
  motifsSelected: Motif[] = [];
  categories = [{libelle:'DETACHEMENT'},{libelle:'DISPONIBILTE'}];
  categorie?: string;

  constructor(
      private typeStructureService: TypeDemandeService,
      private dialogRef: DynamicDialogRef,
      private dynamicDialog: DynamicDialogConfig,
      private confirmationService: ConfirmationService,
      private ampliationService:AmpliationService,
      private articleService:ArticleService,
      private visaService:VisaService,
      private motifService:MotifService
  ) { }

  ngOnInit(): void {
      this.loadVisas();
      this.loadAricles();
      this.loadAmpliations();
      this.loadMotifs();
      if (this.dynamicDialog.data) {
          this.typeDemande = cloneDeep(this.dynamicDialog.data);
      }
  }
  clear(): void {
      this.form.resetForm();
      this.dialogRef.close();
      this.dialogRef.destroy();
  }
  isEditing() {
      return !!this.typeDemande.id;
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

  loadAmpliations() {
      this.ampliationService.findListe().subscribe(response => {
          this.ampliations = response.body!;
      }, error => {
          this.message = { severity: 'error', summary: error.error };
          console.error(JSON.stringify(error));
      });
  }
  loadAricles() {
      this.articleService.findListe().subscribe(response => {
          this.articles = response.body!;
      }, error => {
          this.message = { severity: 'error', summary: error.error };
          console.error(JSON.stringify(error));
      });
  }

  loadVisas() {
      this.visaService.findListe().subscribe(response => {
          this.visas = response.body!;
      }, error => {
          this.message = { severity: 'error', summary: error.error };
          console.error(JSON.stringify(error));
      });
  }

  loadMotifs() {
      this.motifService.findListe().subscribe(response => {
          this.motifs = response.body!;
      }, error => {
          this.message = { severity: 'error', summary: error.error };
          console.error(JSON.stringify(error));
      });
  }
  saveEntity(): void {
      console.warn("typeDemande",this.typeDemande)
      this.clearDialogMessages();
      this.isDialogOpInProgress = true;
      this.typeDemande.ampliations = this.ampliationsSelected;
      this.typeDemande.visas = this.visasSelected;
      this.typeDemande.articles = this.articlesSelected;
      if (this.typeDemande) {
          if (this.typeDemande.id) {
              this.typeStructureService.updateDis(this.typeDemande).subscribe(
                  {
                      next: (response) => {
                          this.dialogRef.close(response);
                          this.dialogRef.destroy();
                          this.showMessage({ severity: 'success', summary: 'structure modifié avec succès' });

                      },
                      error: (error) => {
                          console.error("error" + JSON.stringify(error));
                          this.isOpInProgress = false;
                          this.showMessage({ severity: 'error', summary: error.error.message });

                      }
                  });
          } else {
              this.typeStructureService.createDis(this.typeDemande).subscribe({
                  next: (response) => {
                      this.dialogRef.close(response);
                      this.dialogRef.destroy();
                      this.showMessage({
                          severity: 'success',
                          summary: 'type demande creer avec succès',
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
