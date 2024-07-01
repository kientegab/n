import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { ConfirmationService, Message } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AviserDetachementComponent } from 'src/app/detachement/aviser-detachement/aviser-detachement.component';
import { ReceptionDetachementVComponent } from 'src/app/detachement/reception-detachement-v/reception-detachement-v.component';
import { ReceptionDetachementComponent } from 'src/app/detachement/reception-detachement/reception-detachement.component';
import { IAmpliationDemande, AmpliationDemande } from 'src/app/shared/model/ampliationDemande.model';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { IHistorique, Historique } from 'src/app/shared/model/historique.model';
import { IPieceJointe } from 'src/app/shared/model/pieceJointe.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { ReceptionDisponibiliteVComponent } from '../reception-disponibilite-v/reception-disponibilite-v.component';
import { DemandeDisponibiliteService } from 'src/app/shared/service/demande-disponibilite-service.service';
import { AviserDisponibiliteComponent } from '../aviser-disponibilite/aviser-disponibilite.component';
import { PieceDisponibiliteService } from 'src/app/shared/service/piece-disponibilite.service';
import { ReceptionDisponibiliteComponent } from '../reception-disponibilite/reception-disponibilite.component';

@Component({
  selector: 'app-details-disponibilite-agent',
  templateUrl: './details-disponibilite-agent.component.html',
  styleUrls: ['./details-disponibilite-agent.component.scss']
})
export class DetailsDisponibiliteAgentComponent {
  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  ampliationDemande: IAmpliationDemande = new AmpliationDemande();
  idDmd: number | undefined;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  isLoggedIn = false;
  showDialog = false;
  message: any;
  timeoutHandle: any;
  demandes: any;
  pieceJointes: IPieceJointe[] =[];
  historiques: IHistorique[] =[];
  username!: string;
  profil!: string;

  // historiques: IHistorique[] =[];
  historique:IHistorique = new Historique();

  
  disableVerifierSTDCMEF = true;
  diableViserDCMEF = true;
  disableAviserSH = true;
  disableAviserDRH = true;
  disableAviserSG = true;
  disableReceptionner = true;
  disableReceptionnerV=true;
  disableElaborer = true;
  disableValiderElaboration = true;
  disableSignerElaboration = true;
    disableExporterElaboration = true;
    disableRejeterDemande = true;
    disableRejeterProjet=true;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private demandeService: DemandeDisponibiliteService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private pieceService: PieceDisponibiliteService,
    private confirmationService: ConfirmationService
  ) {}


  ngOnInit(): void {

    this.idDmd = +this.route.snapshot.paramMap.get('id')!;
    this.getDemande();

  }

  /** Permet d'afficher un modal pour la reception */
  openModalReceptionner(demande: IDemande): void {
    this.dialogService.open(ReceptionDisponibiliteComponent,
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

    /** Permet d'afficher un modal pour aviser une demande */
    openModalReceptionnerV(demande: IDemande): void {
      this.dialogService.open(ReceptionDisponibiliteVComponent,
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
          this.showMessage({ severity: 'success', summary: 'Demande Receptionné avec succès' });
        }
  
      });
    }
  
  /** Permet d'afficher un modal pour aviser une demande */
  openModalAviser(demande: IDemande): void {
    this.dialogService.open(AviserDisponibiliteComponent,
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


  showConfirmation() {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir rejeter cette demande?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        // Logique à exécuter si l'utilisateur clique sur "Oui"
        this.rejeterDemande();
      }
    });
  }


  /** Permet d'afficher un modal pour aviser une demande */
   openModalValiderProjet(demande: IDemande): void {
    /*this.dialogService.open(ValiderProjetComponent,
    {
      header: 'Valider un projet',
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
        this.showMessage({ severity: 'success', summary: 'Projet validé avec succès' });
      }

    });
*/
      this.router.navigate(['detachements','elaborer', demande.id]);
  }
  openModalElaborerProjet(demande:IDemande): void {
     /* this.demandeService.printArrete(this.demande.id!,false).subscribe({
          next: (response) => {
              saveAs(response, 'Arrete' + this.demande.numero + '.pdf')
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({
                  severity: 'success',
                  summary: 'Document telechargé avec succès',
              });
          },
          error: (error) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

          }
      });*/
   this.router.navigate(['detachements','elaborer', demande.id]);
  }


  openModalVerifierProjet(demande:IDemande): void {
    /* this.demandeService.printArrete(this.demande.id!,false).subscribe({
         next: (response) => {
             saveAs(response, 'Arrete' + this.demande.numero + '.pdf')
             this.dialogRef.close(response);
             this.dialogRef.destroy();
             this.showMessage({
                 severity: 'success',
                 summary: 'Document telechargé avec succès',
             });
         },
         error: (error) => {
             console.error("error" + JSON.stringify(error));
             this.isOpInProgress = false;
             this.showMessage({ severity: 'error', summary: error.error.message });

         }
     });*/
  this.router.navigate(['detachements','elaborer', demande.id]);
 }

 openModalViserProjet(demande:IDemande): void {
  /* this.demandeService.printArrete(this.demande.id!,false).subscribe({
       next: (response) => {
           saveAs(response, 'Arrete' + this.demande.numero + '.pdf')
           this.dialogRef.close(response);
           this.dialogRef.destroy();
           this.showMessage({
               severity: 'success',
               summary: 'Document telechargé avec succès',
           });
       },
       error: (error) => {
           console.error("error" + JSON.stringify(error));
           this.isOpInProgress = false;
           this.showMessage({ severity: 'error', summary: error.error.message });

       }
   });*/
this.router.navigate(['detachements','elaborer', demande.id]);
}





  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }

  fermer(): void {
    this.router.navigate(['detachements','agents']);
  }

  getDemande(): void {
    this.demandeService.find(this.idDmd!).subscribe(result => {
      if (result && result.body) {
        this.demande = result.body;
        this.getPieceByDmd(this.demande.id!);
        this.getHistoriquesByDmd(this.demande.id!);

        this.isLoggedIn = !!this.tokenService.getToken();

        if (this.isLoggedIn) {
          const user = this.tokenService.getUser();
          this.username = user.username;
          this.profil = user.profil;

          if(this.demande.statut === 'INITIEE' && this.profil === 'SH') {
            this.disableAviserSH = false;
          }

          if (this.demande.statut === 'AVIS_SH' && (this.profil === 'STDRH' || this.profil === 'STDGFP')) {
            this.disableReceptionner = false;
          }

          if(this.demande.statut === 'RECEPTIONEE' && (this.profil === 'DRH' || this.profil === 'DGFP')) {
            this.disableAviserDRH = false;
          }

          if((this.demande.statut === 'AVIS_DRH' || this.demande.statut === 'AVIS_DGFP') && this.profil === 'SG') {
            this.disableAviserSG = false;
            this.disableRejeterDemande = false;
        }

          if (this.demande.statut === 'DEMANDE_VALIDEE' && (this.profil === 'STDRH' || this.profil === 'STDGF')) {
            this.disableElaborer = false;
          }


            if (this.demande.statut === 'PROJET_ELABORE' && (this.profil === 'DRH')) {
                this.disableValiderElaboration = false;
            }

            if (this.demande.statut === 'PROJET_REJETE' && (this.profil === 'STDRH')) {
              this.disableElaborer = false;
          }
            if (this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
                this.disableSignerElaboration = false;
                this.disableRejeterProjet = false;
            }

            if (this.demande.statut === 'PROJET_SIGNE') {
                this.disableExporterElaboration = false;
            }

//////////////////////////////////////////////////////////////////Renouvellement&Fin///////////////////////////////////////////////////////////////////////////////////

 if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') &&   (this.demande.statut === 'PROJET_ELABORE') && (this.profil === 'STDCMEF')) {
                this.disableVerifierSTDCMEF = false;
            }


            if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') &&   (this.demande.statut === 'PROJET_VERIFIE') && (this.profil === 'DCMEF')) {
              this.diableViserDCMEF=false;
          }


            if ( (this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') &&   (this.demande.statut === 'PROJET_VISE') && (this.profil === 'DRH')) {
              this.disableValiderElaboration = false;
          }


          if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') && this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
            this.disableSignerElaboration = false;
        }

           
            if ((this.demande.typeDemande?.libelle ==='Demande de renouvellement de détachement'||this.demande.typeDemande?.libelle ==='Demande de fin de détachement de détachement') && this.demande.statut === 'PROJET_SIGNE') {
                this.disableExporterElaboration = false;
            }



////////////////////////////////////////////////////////////////////////Rectification&Annulation///////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
      }
    });
  }

    exporter(){
        this.demandeService.printArrete(this.demande.id!,false).subscribe({
            next: (response) => {
                saveAs(response, 'Arrete' + this.demande.numero + '.pdf')
                this.showMessage({
                    severity: 'success',
                    summary: 'Document telechargé avec succès',
                });
            },
            error: (error) => {
                console.error("error" + JSON.stringify(error));
                this.isOpInProgress = false;
                this.showMessage({ severity: 'error', summary: error.error.message });

        console.warn("OBJET DEMANDE",this.demande)
            }
        });
    }

  getPieceByDmd(dmdId: number){
    this.demandeService.findPiecesByDemande(dmdId).subscribe(result => {
        if (result && result.body) {
            this.pieceJointes = result.body;
        }
    });
  }

  async voirPiece(filname?: string): Promise<void> {
          if (filname) {
              const link = await this.pieceService.visualiser(
                  filname
              );
              if (link) {
                  window.open(link, '_blank');
              }
          }
  }

  getHistoriquesByDmd(dmdId: number){
    this.demandeService.findHistoriquesByDemande(dmdId).subscribe(result => {
        if (result && result.body) {
            this.historiques = result.body;
            // console.log("Listes historiques ======", this.historiques);
        }
    });
  }

    openModalSignatureProjet(demande:IDemande): void {
        this.router.navigate(['detachements','elaborer', demande.id]);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
rejeterDemande(): void {
  this.confirmationService.confirm({
    header: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir rejeter cette demande?',
    accept: () => {
      // Code à exécuter si l'utilisateur clique sur le bouton "Accepter" dans la boîte de dialogue de confirmation
      this.isDialogOpInProgress = true;

      if (this.demande) {
        this.demande.historique = this.historique;
        this.demandeService.rejeterSG(this.demande).subscribe({
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

rejeterElaboration(): void {
  this.isDialogOpInProgress = true;
  if (this.demande) {
      this.demande.historique = this.historique;
      this.demandeService.rejeterElaborationSG(this.demande).subscribe(
          {
              // next: (response: any) => {
              //     this.print();
              // },
              error: (error: { error: { message: any; }; }) => {
                  console.error("error" + JSON.stringify(error));
                  this.isOpInProgress = false;
                  this.showMessage({ severity: 'error', summary: error.error.message });

              }
          });

  }
}

  
}
