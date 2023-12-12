import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { AviserDetachementComponent } from '../aviser-detachement/aviser-detachement.component';
import { ReceptionDetachementComponent } from '../reception-detachement/reception-detachement.component';
import {IPieceJointe} from "../../shared/model/pieceJointe.model";
import {PieceService} from "../../shared/service/piece.service";
import { IHistorique } from 'src/app/shared/model/historique.model';
import { TokenService } from 'src/app/shared/service/token.service';
import {saveAs} from "file-saver";

@Component({
  selector: 'app-details-detachement-agent',
  templateUrl: './details-detachement-agent.component.html',
  styleUrls: ['./details-detachement-agent.component.scss']
})
export class DetailsDetachementAgentComponent {

  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
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

  disableVerifierSTDCMEF = true;
  diableViserDCMEF = true;
  disableAviserSH = true;
  disableAviserDRH = true;
  disableAviserSG = true;
  disableReceptionner = true;
  disableElaborer = true;
  disableValiderElaboration = true;
  disableSignerElaboration = true;
    disableExporterElaboration = true;


  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private demandeService: DemandeService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private pieceService: PieceService
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
          }

          if (this.demande.statut === 'DEMANDE_VALIDEE' && (this.profil === 'STDRH' || this.profil === 'STDGF')) {
            this.disableElaborer = false;
          }
            if (this.demande.statut === 'PROJET_ELABORE' && (this.profil === 'DRH')) {
                this.disableValiderElaboration = false;
            }
            if (this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
                this.disableSignerElaboration = false;
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


}
