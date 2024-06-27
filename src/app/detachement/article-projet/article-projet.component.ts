import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ConfirmationService, Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ArticleDemande, IArticleDemande } from 'src/app/shared/model/articleDemande.model';
import { Demande, IDemande } from 'src/app/shared/model/demande.model';
import { ArticleProjetService } from 'src/app/shared/service/article-projet.service';
// import { Article, IArticleDemande } from 'src/app/shared/model/article.model';
// import { articleProjetService } from 'src/app/shared/service/article.service';

@Component({
  selector: 'app-article-projet',
  templateUrl: './article-projet.component.html',
  styleUrls: ['./article-projet.component.scss']
})
export class ArticleProjetComponent {


  @ViewChild('dtf') form!: NgForm;
  articleDemande: IArticleDemande = new ArticleDemande();
  @Input() data: IArticleDemande = new ArticleDemande();
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
    private articleProjetService: ArticleProjetService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit(): void {
   
    if (this.dynamicDialog.data) {
      this.articleDemande = cloneDeep(this.dynamicDialog.data);
      // this.demandes.push(this.demande);
    }
  }

  clear(): void {
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  isEditing() {
    return !!this.articleDemande.id;
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

    console.log("ID de l'article :", this.articleDemande.id);

    if (this.articleDemande && this.articleDemande.id) {
        console.log("Mise à jour d'article");

        console.log("article à envoyer", this.articleDemande);

        this.articleProjetService.update(this.articleDemande).subscribe({
            next: (response) => {
                console.log("Réponse de mise à jour :", response);

                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'article modifié avec succès' });
            },
            error: (error) => {
                console.error("Erreur de mise à jour :", JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });
            }
        });
    } else {
        console.log("Création d'article");

    //    this.articleDemande.demande = this.demande;
        console.log("article à envoyer", this.articleDemande);

        this.articleProjetService.create(this.articleDemande).subscribe({
            next: (response) => {
                console.log("Réponse de création :", response);

                this.dialogRef.close(response);
                this.dialogRef.destroy();
                this.showMessage({ severity: 'success', summary: 'article creer avec succès' });
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

