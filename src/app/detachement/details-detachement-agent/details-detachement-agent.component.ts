import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { AviserDetachementComponent } from '../aviser-detachement/aviser-detachement.component';
import { ReceptionDetachementComponent } from '../reception-detachement/reception-detachement.component';
import {IPieceJointe} from "../../shared/model/pieceJointe.model";
import {PieceService} from "../../shared/service/piece.service";
import { Historique, IHistorique } from 'src/app/shared/model/historique.model';
import { TokenService } from 'src/app/shared/service/token.service';
import {saveAs} from "file-saver";
import { AmpliationDemande, IAmpliationDemande } from 'src/app/shared/model/ampliationDemande.model';
import { ReceptionDetachementVComponent } from '../reception-detachement-v/reception-detachement-v.component';
import { ImputerDemandeComponent } from '../imputer-demande/imputer-demande.component';
import { AnalyserDisponibiliteComponent } from '../analyser-disponibilite/analyser-disponibilite.component';
import { ValiderDetachementComponent } from '../valider-detachement/valider-detachement.component';

@Component({
  selector: 'app-details-detachement-agent',
  templateUrl: './details-detachement-agent.component.html',
  styleUrls: ['./details-detachement-agent.component.scss']
})
export class DetailsDetachementAgentComponent {

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
  disableAnalyserCA = true;
  disableReceptionner = true;
  disableReceptionnerV=true;
  disableElaborer = true;
  disableValiderElaboration = true;
  disableSignerElaboration = true;
    disableExporterElaboration = true;
    disableImputerDemande = true;
    disableRejeterDemandeDRH = true;
    disableRejeterProjet=true;
    disableGenerateDemande=true;
    disablemodifierCADemande=true;
    disableRejeterDemandeSG = true;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private demandeService: DemandeService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private pieceService: PieceService,
    private confirmationService: ConfirmationService
  ) {}


  ngOnInit(): void {

    this.idDmd = +this.route.snapshot.paramMap.get('id')!;
    this.getDemande();

  }

  /** Permet d'afficher un modal pour la reception */
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
  openModalRejetter(demande: IDemande): void {
    this.dialogService.open(ValiderDetachementComponent,
      {
        header: 'Rejetter une demande pour modification',
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
          this.showMessage({ severity: 'success', summary: 'Demande rejettée pour modification avec succès' });
        }
      });
  }
  

  openModalReceptionnerV(): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir receptionner cette demande?',
      accept: () => {
        // Code à exécuter si l'utilisateur clique sur le bouton "Accepter" dans la boîte de dialogue de confirmation
        this.isDialogOpInProgress = true;
  
        if (this.demande) {
          this.demande.historique = this.historique;
          this.demandeService.receptionV(this.demande).subscribe({
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

    /** Permet d'afficher un modal pour aviser une demande */
    // openModalReceptionnerV(demande: IDemande): void {
    //   this.dialogService.open(ReceptionDetachementVComponent,
    //   {
    //     header: 'Receptionner une demande',
    //     width: '40%',
    //     contentStyle: { overflow: 'auto' },
    //     baseZIndex: 10000,
    //     maximizable: true,
    //     closable: true,
    //     data: demande
    //   }).onClose.subscribe(result => {
    //     if(result){
    //       this.isDialogOpInProgress = false;
    //       window.location.reload();
    //       this.showMessage({ severity: 'success', summary: 'Demande Receptionné avec succès' });
    //     }
  
    //   });
    // }
  
  /** Permet d'afficher un modal pour aviser une demande */
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
   /** Permet d'afficher un modal pour aviser une demande */
   openModalAnalyser(demande: IDemande): void {
    this.dialogService.open(AnalyserDisponibiliteComponent,
    {
      header: 'Analyser une demande',
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


  openModalEdit(demande: IDemande): void {
    this.router.navigate(['detachements','edit', demande.id]);

  }


openModalImputerDemande(demande: IDemande): void {
  this.dialogService.open(ImputerDemandeComponent,
  {
    header: 'Imputer une demande',
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
      this.showMessage({ severity: 'success', summary: 'Demande imputée avec succès' });
    }

  });
}
downloadActe(demande: IDemande): void {
  if (demande.id !== undefined) {
    this.demandeService.downloadActe(demande.id).subscribe(
      (response: Blob) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      },
      (error) => {
        console.error('Erreur lors de la génération du récépissé : ', error);
        // Gérer les erreurs ici...
      }
    );
  } else {
    console.error('ID de demande non défini.');
    // Gérer le cas où ID est undefined (optionnel)
  }
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

          if(this.demande.statut === 'PAYEE' && this.profil === 'SH') {
            this.disableAviserSH = false;
          }

          if (this.demande.statut === 'AVIS_SH' && (this.profil === 'CSTDRH' || this.profil === 'STDGFP')) {
            this.disableReceptionner = true;
          }

          if(this.demande.statut === 'CONFORME' && (this.profil === 'DRH' || this.profil === 'DGFP')) {
            this.disableAviserDRH = false;
            this.disableRejeterDemandeDRH = false;
          }
         
          if((this.demande.statut === 'IMPUTEE') && (this.profil === 'CA' )) {
            this.disableAnalyserCA = false;
          }
          if((this.demande.statut === 'REJET_DRH'|| this.demande.statut === 'REJET_SG') && (this.profil === 'CA' )) {
            this.disablemodifierCADemande = false;
          }
          

          if((this.demande.statut === 'AVIS_DRH' || this.demande.statut === 'AVIS_DGFP') && this.profil === 'SG') {
            this.disableAviserSG = false;
        this.disableRejeterDemandeSG = false;
        }
        
        if ((this.demande.statut === 'DEMANDE_VALIDEE'|| this.demande.statut === 'ELABORATION')  && (this.profil === 'STDRH' || this.profil === 'STDGF')) {
          this.disableGenerateDemande = false;
        }

          if (this.demande.statut === 'DEMANDE_VALIDEE' && (this.profil === 'STDRH' || this.profil === 'STDGF')) {
            this.disableReceptionnerV = false;
          }
      
          //   if (this.demande.statut === 'PROJET_ELABORE' && (this.profil === 'DRH')) {
          //       this.disableValiderElaboration = false;
          //   }

          //   if (this.demande.statut === 'PROJET_REJETE' && (this.profil === 'STDRH')) {
          //     this.disableElaborer = false;
          // }
          //   if (this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
          //       this.disableSignerElaboration = false;
          //       this.disableRejeterProjet = false;
          //   }

          //   if (this.demande.statut === 'PROJET_SIGNE') {
          //       this.disableExporterElaboration = false;
          //   }


            if (this.demande.statut === 'AVIS_SH' && (this.profil === 'CSTDRH')) {
              this.disableImputerDemande = false;
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
        this.demandeService.rejeterDRH(this.demande).subscribe({
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
generateDemande(demande: IDemande): void {
  if (demande.id !== undefined) {
    this.demandeService.generateDemande(demande.id).subscribe(
      (response: Blob) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      },
      (error) => {
        console.error('Erreur lors de la génération de la demande : ', error);
        // Gérer les erreurs ici...
      }
    );
  } else {
    console.error('ID de demande non défini.');
    // Gérer le cas où ID est undefined (optionnel)
  }
  
}

}
