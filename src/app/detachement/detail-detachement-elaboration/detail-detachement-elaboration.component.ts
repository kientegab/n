import { Component } from '@angular/core';
import {Visa} from "../../shared/model/visa.model";
import {Article} from "../../shared/model/article.model";
import {Ampliation} from "../../shared/model/ampliation.model";
import {Demande, IDemande} from "../../shared/model/demande.model";
import {AviserDetachementComponent} from "../aviser-detachement/aviser-detachement.component";
import {DialogService} from "primeng/dynamicdialog";
import {DemandeService} from "../../shared/service/demande-service.service";
import {TokenService} from "../../shared/service/token.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, Message} from "primeng/api";
import {ReceptionDetachementComponent} from "../reception-detachement/reception-detachement.component";
import {Historique, IHistorique} from "../../shared/model/historique.model";
import {ValiderElaborationModalComponent} from "../valider-elaboration-modal/valider-elaboration-modal.component";
import { saveAs } from "file-saver";
import { VerifierProjetComponent } from '../verifier-projet/verifier-projet.component';
import { ViserProjetComponent } from '../viser-projet/viser-projet.component';
import { VisaProjetComponent } from '../visa-projet/visa-projet.component';
import { ArticleProjetComponent } from '../article-projet/article-projet.component';
import { AmpliationProjetComponent } from '../ampliation-projet/ampliation-projet.component';
import { VisaService } from 'src/app/shared/service/visa-service';
import { ArticleService } from 'src/app/shared/service/article.service';
import { AmpliationService } from 'src/app/shared/service/ampliation-service.service';
import { IVisaDemande, VisaDemande } from 'src/app/shared/model/visaDemande.model';
import { VisaProjetService } from 'src/app/shared/service/visa-projet.service';
import { ArticleDemande, IArticleDemande } from 'src/app/shared/model/articleDemande.model';
import { AmpliationDemande, IAmpliationDemande } from 'src/app/shared/model/ampliationDemande.model';
import { ArticleProjetService } from 'src/app/shared/service/article-projet.service';
import { AmpliationProjetService } from 'src/app/shared/service/ampliation-projet.service';

@Component({
  selector: 'app-detail-detachement-elaboration',
  templateUrl: './detail-detachement-elaboration.component.html',
  styleUrls: ['./detail-detachement-elaboration.component.scss']
})
export class DetailDetachementElaborationComponent {

    isOpInProgress!: boolean;
    isDialogOpInProgress!: boolean;
    showDialog = false;
    message: any;
    timeoutHandle: any;
    isLoggedIn = false;
    totalRecords: number = 0;
    visas: Visa[] = [];
    visaDemandes: VisaDemande[] = [];
    articleDemandes: ArticleDemande[] = [];
    ampliationDemandes: AmpliationDemande[] = [];
    ampliationDemande:IAmpliationDemande = new AmpliationDemande();
    demandes: Demande[]=[];
    enableBtnDelete=true;
    enableBtnEdit= true;
    articles:  Article[] = [];
    ampliations: Ampliation[] = [];
    disableAviserSH = true;
    disableAviserDRH = true;
    disableAviserSG = true;
    disableReceptionner = true;
    disableElaborer = true;
    disableValiderElaboration = true;
    disableSignerElaboration = true;
    disableVerifierSTDCMEF = true;
    diableViserDCMEF = true;
    disableReceptionner2=true;
    disableExporterElaboration = true;
    disableRejeterDemande = true;
    disableRejeterProjet = true;
    disableVisaProjet = true;
    disableArticleProjet = true;
    disableAmpliationProjet = true;

    demande: Demande = new  Demande();
    username!: string;
    profil!: string;
    idDmd?: number;
    historiques: IHistorique[] =[];
    historique:IHistorique = new Historique();


    constructor(
        private dialogService: DialogService,
        private demandeService: DemandeService,
        private visaService: VisaService,
        private visaDemandeService: VisaProjetService,
        private articleDemandeService: ArticleProjetService,
        private ampliationDemandeService: AmpliationProjetService,
        private articleService: ArticleService,
        private ampliationService: AmpliationService,
        private tokenService: TokenService,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {

        this.idDmd = +this.route.snapshot.paramMap.get('id')!;
    //    this.getAmpliationDemande();
        this.getDemande();
        this.loadVisa();
        this.loadArticle();
        this.loadAmpliation();
        this.loadVisaDemandes(this.idDmd);
        this.loadArticlesDemandes(this.idDmd);
        this.loadAmpliationsDemandes(this.idDmd);
      
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onDelete(ampliationDemande: IAmpliationDemande) {
    //    this.getAmpliationDemande();
        console.log("ampliationDemandeId",ampliationDemande);
        if (ampliationDemande.id) {
          this.confirmationService.confirm({
            message: 'Etes-vous sûr de vouloir supprimer ce ampliation?',
            accept: () => {
              this.deleteAmpliation(ampliationDemande);
            }
          });
        } else {
          // Gérer le cas où l'id est indéfini
          console.error('L\'ID de l\'ampliationDemande est indéfini.');
        }
      }
      
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    deleteAmpliation(selection: any) {
        this.isOpInProgress = true;
        this.ampliationDemandeService.delete(selection.id).subscribe(() => {
          this.ampliationDemandes = this.ampliationDemandes.filter(ampliationDemande => ampliationDemande.id !== selection.id);
      //    this.demandes = this.demandes.filter(demande => demande.id !== selection.id);
          selection = null;
          this.isOpInProgress = false;
        this.totalRecords--;
          this.showMessage({
            severity: 'success',
            summary: 'ampliation supprimée avec succès',
          });
        }, (error) => {
          console.error("ampliation " + JSON.stringify(error));
          this.isOpInProgress = false;
          this.showMessage({ severity: 'error', summary: error.error.message });
        });
      }


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
openModalVisa(demande:IDemande): void {
    const demandeVisa = new VisaDemande();

    demandeVisa.demande = demande;
    this.dialogService.open(VisaProjetComponent,
        {
            header: 'Ajouter un visa',
            width: '40%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: demandeVisa
        }).onClose.subscribe(result => {
        if(result){
            this.isDialogOpInProgress = false;
            window.location.reload();
            this.showMessage({ severity: 'success', summary: 'Visa ajouté avec succès' });
        }

    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
openModalArticle(demande:IDemande): void {
    const demandeArticle = new ArticleDemande();

    demandeArticle.demande = demande;
    this.dialogService.open(ArticleProjetComponent,
        {
            header: 'Ajouter un article',
            width: '40%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: demandeArticle
        }).onClose.subscribe(result => {
        if(result){
            this.isDialogOpInProgress = false;
            window.location.reload();
            this.showMessage({ severity: 'success', summary: 'article ajouté avec succès' });
        }

    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

openModalAmpliation(demande:IDemande): void {

    const demandeAmpliation = new AmpliationDemande();

    demandeAmpliation.demande = demande;

    this.dialogService.open(AmpliationProjetComponent,
        {
            header: 'Ajouter une ampliation',
            width: '40%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: demandeAmpliation
        }).onClose.subscribe(result => {
        if(result){
            this.isDialogOpInProgress = false;
            window.location.reload();
            this.showMessage({ severity: 'success', summary: 'ampliation ajouté avec succès' });
        }

    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadVisa() {
    this.visaService.findAll().subscribe(response => {
        this.visas = response.body!;
       console.warn("Liste des visas",this.visas);
    }, error => {
        this.message = {severity: 'error', summary: error.error};
        console.error(JSON.stringify(error));
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadArticle() {
    this.articleService.findAll().subscribe(response => {
        this.articles = response.body!;
       console.warn("Liste des articles",this.articles);
    }, error => {
        this.message = {severity: 'error', summary: error.error};
        console.error(JSON.stringify(error));
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadAmpliation() {
    this.ampliationService.findAll().subscribe(response => {
        this.ampliations = response.body!;
       console.warn("Liste des ampliations",this.ampliations);
    }, error => {
        this.message = {severity: 'error', summary: error.error};
        console.error(JSON.stringify(error));
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadVisaDemandes(idDemande:number):void {
    this.visaDemandeService.findVisaByDemande(idDemande).subscribe((response:any) => {
        this.visaDemandes = response.body!;
       console.warn("Liste des visas spécifiques à la demande",this.visaDemandes);
    }, (error: any) => {
        this.message = { severity: 'error', summary: error.error };
        console.error(JSON.stringify(error));
    }
);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadArticlesDemandes(idDemande:number):void {
    this.articleDemandeService.findArticleByDemande(idDemande).subscribe((response:any) => {
        this.articleDemandes = response.body!;
       console.warn("Liste des articles spécifiques à la demande",this.articleDemandes);
    }, (error: any) => {
        this.message = { severity: 'error', summary: error.error };
        console.error(JSON.stringify(error));
    }
);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadAmpliationsDemandes(idDemande:number):void {
    this.ampliationDemandeService.findAmpliationByDemande(idDemande).subscribe((response:any) => {
        this.ampliationDemandes = response.body!;
       console.warn("Liste des ampliations spécifiques à la demande",this.ampliationDemandes);
    }, (error: any) => {
        this.message = { severity: 'error', summary: error.error };
        console.error(JSON.stringify(error));
    }
);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
getAmpliationDemande(id:number): void {
    this.ampliationDemandeService.find(id).subscribe(result => {
        if (result && result.body) {
            this.ampliationDemande = result.body;
        }})
        console.log("contenu des ampliations demandes",this.ampliationDemande) 
       }
       ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       openModalVisaEdit(visaDemande: IVisaDemande): void {

        console.log("=========VisaDemande=========",visaDemande)
        this.dialogService.open(VisaProjetComponent,
          {
            header: 'Modifier un visa',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: visaDemande
          }).onClose.subscribe(result => {
            if(result){
              this.isDialogOpInProgress = false;
             // this.loadAmpliationsDemandes(this.idDmd!);
              window.location.reload();
              this.showMessage({ severity: 'success', summary: 'visa modifiée avec succès' });
            }
           
          });
    
      }
       
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

openModalArticleEdit(articleDemande: IArticleDemande): void {

    console.log("=========ArticleDemande=========",articleDemande)
    this.dialogService.open(ArticleProjetComponent,
      {
        header: 'Modifier un article',
        width: '60%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        closable: true,
        data: articleDemande
      }).onClose.subscribe(result => {
        if(result){
          this.isDialogOpInProgress = false;
        //  this.loadAmpliationsDemandes(this.idDmd!);
          window.location.reload();
          this.showMessage({ severity: 'success', summary: 'article modifiée avec succès' });
        }
       
      });

  }
       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       openModalEdit(ampliationDemande: IAmpliationDemande): void {

        console.log("=========AmpliationDemande=========",ampliationDemande)
        this.dialogService.open(AmpliationProjetComponent,
          {
            header: 'Modifier un ampliation',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: ampliationDemande
          }).onClose.subscribe(result => {
            if(result){
              this.isDialogOpInProgress = false;
              this.loadAmpliationsDemandes(this.idDmd!);
              this.showMessage({ severity: 'success', summary: 'ampliation modifiée avec succès' });
            }
           
          });

      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getDemande(): void {
        this.demandeService.find(this.idDmd!).subscribe(result => {
            if (result && result.body) {
                this.demande = result.body;
                this.ampliations = this.demande.typeDemande?.ampliations!;
                this.visas = this.demande.typeDemande?.visas!;
                this.articles = this.demande.typeDemande?.articles!;
                this.getHistoriquesByDmd(this.demande.id!);
                console.warn("DEMANDE",result.body);
                console.warn("visas", this.demande.typeDemande?.visas!);

                this.isLoggedIn = !!this.tokenService.getToken();

                if (this.isLoggedIn) {
                    const user = this.tokenService.getUser();
                    this.username = user.username;
                    this.profil = user.profil;

                    if(this.demande.statut === 'PAYEE' && this.profil === 'SH') {
                        this.disableAviserSH = false;
                    }

                    if (this.demande.statut === 'AVIS_SH' && (this.profil === 'STDRH' || this.profil === 'STDGFP')) {
                        this.disableReceptionner = false;
                    }

                    if(this.demande.statut === 'RECEPTIONEE' && (this.profil === 'DRH' || this.profil === 'DGFP')) {
                        this.disableAviserDRH = false;
                    }

                    if((this.demande.statut === 'AVIS_DRH' || this.demande.statut === 'AVIS_DGFP') && this.profil === 'SG') {
                        this.disableAviserSG = false && this.disableRejeterDemande == false;
                    }

                    if (this.demande.statut === 'DEMANDE_VALIDEE' && (this.profil === 'STDRH')) {
                        this.disableElaborer = false;
                        this.disableVisaProjet = false;
                        this.disableArticleProjet = false;
                        this.disableAmpliationProjet = false;
                    }

                    if (this.demande.statut === 'PROJET_ELABORE' && (this.profil === 'DRH')) {
                        this.disableValiderElaboration = false;
                        this.disableRejeterProjet = false;
                    }
                    
                    if (this.demande.statut === 'PROJET_REJETE' && (this.profil === 'STDRH')) {
                        this.disableElaborer = false;
                        this.disableVisaProjet = false;
                        this.disableArticleProjet = false;
                        this.disableAmpliationProjet = false;
                    }



                    if (this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
                        this.disableSignerElaboration = false;
                        this.disableRejeterProjet = false;
                    }




                    if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') &&   (this.demande.statut === 'PROJET_ELABORE') && (this.profil === 'STDCMEF')) {
                        this.disableVerifierSTDCMEF = false;
                    }
        
        
                    if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') &&   (this.demande.statut === 'PROJET_VERIFIE') && (this.profil === 'DCMEF')) {
                      this.diableViserDCMEF=false;
                  }
        
        
                    if ( (this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') &&   (this.demande.statut === 'PROJET_VISE') && (this.profil === 'DRH')) {
                      this.disableValiderElaboration = false;
                      this.disableRejeterProjet = false;
                  }
        
        
                  if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') && this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
                    this.disableSignerElaboration = false;
                    this.disableRejeterProjet = false;
                }
        
                   
                    if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') && this.demande.statut === 'PROJET_SIGNE') {
                        this.disableExporterElaboration = false;
                    }
                }
            }
        });
    }

    getHistoriquesByDmd(dmdId: number){
        this.demandeService.findHistoriquesByDemande(dmdId).subscribe(result => {
            if (result && result.body) {
                this.historiques = result.body;
            }
        });
    }

    elaborer(): void {
        this.isDialogOpInProgress = true;
        if (this.demande) {
            this.demande.historique = this.historique;
            this.demandeService.elaborationSTDRH(this.demande).subscribe(
                {
                    next: (response: any) => {
                        this.router.navigate(['detachements','agents']);
                        this.showMessage({ severity: 'success', summary: "Processus d'élaboration déclenchée"});

                    },
                    error: (error: { error: { message: any; }; }) => {
                        console.error("error" + JSON.stringify(error));
                        this.isOpInProgress = false;
                        this.showMessage({ severity: 'error', summary: error.error.message });

                    }
                });

        }
    }

    signerElaboration(): void {
        this.isDialogOpInProgress = true;
        if (this.demande) {
            this.demande.historique = this.historique;
            this.demandeService.signerElaborationSG(this.demande).subscribe(
                {
                    next: (response: any) => {
                        this.print();
                    },
                    error: (error: { error: { message: any; }; }) => {
                        console.error("error" + JSON.stringify(error));
                        this.isOpInProgress = false;
                        this.showMessage({ severity: 'error', summary: error.error.message });

                    }
                });

        }
    }


    showConfirmation() {
        this.confirmationService.confirm({
          header: 'Confirmation',
          message: 'Êtes-vous sûr de vouloir rejeter le projet élaboré?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Oui',
          rejectLabel: 'Non',
          accept: () => {
            // Logique à exécuter si l'utilisateur clique sur "Oui"
            this.rejeterDemande();
          }
        });
      }





    rejeterElaboration(): void {
        this.confirmationService.confirm({
          header: 'Confirmation',
          message: 'Êtes-vous sûr de vouloir rejeter le projet élaboré?',
          accept: () => {
            // Code à exécuter si l'utilisateur clique sur le bouton "Accepter" dans la boîte de dialogue de confirmation
            this.isDialogOpInProgress = true;
      
            if (this.demande) {
              this.demande.historique = this.historique;
              this.demandeService.rejeterElaborationSG(this.demande).subscribe({
                // ...
              });
              window.location.reload();
            }
          },
          reject: () => {
            // Code à exécuter si l'utilisateur clique sur le bouton "Annuler" dans la boîte de dialogue de confirmation
            // Vous pouvez ne rien faire ici si vous ne souhaitez pas exécuter d'action spécifique lors du rejet
          },
        });
      }

    rejeterDemande(): void {
        this.isDialogOpInProgress = true;
        if (this.demande) {
            this.demande.historique = this.historique;
            this.demandeService.rejeterSG(this.demande).subscribe(
                {
                    next: (response: any) => {
                        this.print();
                    },
                    error: (error: { error: { message: any; }; }) => {
                        console.error("error" + JSON.stringify(error));
                        this.isOpInProgress = false;
                        this.showMessage({ severity: 'error', summary: error.error.message });

                    }
                });

        }
    }




    openModalAviser(demande: IDemande): void {
        this.dialogService.open(AviserDetachementComponent,
            {
                header: 'Aviser une demande',
                width: '40%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                closable: true,
                data: demande
            }).onClose.subscribe(result => {
            if(result){
                this.isDialogOpInProgress = false;
                window.location.reload();
                this.showMessage({ severity: 'success', summary: 'Demande avisée avec succès' });
            }

        });
    }

    openModalElaborerProjet(demande:IDemande): void {

        // this.router.navigate(['detachements','elaborer', demande.id]);
    }

    openModalReceptionner(demande: IDemande): void {
        this.dialogService.open(ReceptionDetachementComponent,
            {
                header: 'Receptionner une demande',
                width: '40%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                closable: true,
                data: demande
            }).onClose.subscribe(result => {
            if(result){
                this.isDialogOpInProgress = false;
                window.location.reload();
                this.showMessage({ severity: 'success', summary: 'Demande receptionnée avec succès' });
            }

        });

    }


    openModalVerifierProjet(demande:IDemande): void {
        this.dialogService.open(VerifierProjetComponent,
            {
                header: 'Vérifier le projet',
                width: '40%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                closable: true,
                data: demande
            }).onClose.subscribe(result => {
            if(result){
                this.isDialogOpInProgress = false;
                window.location.reload();
                this.showMessage({ severity: 'success', summary: 'Demande verifiée avec succès' });
            }

        });
     }
    
     openModalViserProjet(demande:IDemande): void {
        this.dialogService.open(ViserProjetComponent,
            {
                header: 'Viser une demande',
                width: '40%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                closable: true,
                data: demande
            }).onClose.subscribe(result => {
            if(result){
                this.isDialogOpInProgress = false;
                window.location.reload();
                this.showMessage({ severity: 'success', summary: 'Demande visée avec succès' });
            }

        });
    }
    

    showMessage(message: Message) {
        this.message = message;
        this.timeoutHandle = setTimeout(() => {
            this.message = null;
        }, 5000);
    }
    fermer(): void {
        this.router.navigate(['detachements','agents']);
    }

    openModalValiderElaborerProjet(demande: Demande) {
        this.dialogService.open(ValiderElaborationModalComponent,
            {
                header: 'Valider élaboration',
                width: '40%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                closable: true,
                data: demande
            }).onClose.subscribe(result => {
            if(result){
                this.isDialogOpInProgress = false;
                this.router.navigate(['detachements','agents']);
            }

        });
    }

    print(){
       this.demandeService.printArrete(this.demande.id!,false).subscribe({
          next: (response) => {
              saveAs(response, 'Arrete' + this.demande.numero + '.pdf')
              this.showMessage({
                  severity: 'success',
                  summary: 'Document telechargé avec succès',
              });
              this.router.navigate(['detachements','agents']);
          },
          error: (error) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

          }
      });
    }



    }

