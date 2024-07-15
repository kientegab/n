import { Component, Input } from '@angular/core';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AviserDetachementComponent } from '../aviser-detachement/aviser-detachement.component';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { ReceptionDetachementComponent } from '../reception-detachement/reception-detachement.component';
import { ValiderProjetComponent } from '../valider-projet/valider-projet.component';
import { IHistorique } from 'src/app/shared/model/historique.model';
import { IPieceJointe } from 'src/app/shared/model/pieceJointe.model';
import { PieceService } from 'src/app/shared/service/piece.service';
import {saveAs} from "file-saver";
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-details-detachement',
  templateUrl: './details-detachement.component.html',
  styleUrls: ['./details-detachement.component.scss']
})
export class DetailsDetachementComponent {

  demande: IDemande = new Demande(); 
  @Input() data: IDemande = new Demande();
  idDmd: number | undefined;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  message: any;
  isLoggedIn = false;
  timeoutHandle: any;
  pieceJointes: IPieceJointe[] =[];
  historiques: IHistorique[] =[];
  disableExporterElaboration = true;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private demandeService: DemandeService,
    private pieceService: PieceService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService

  ) {}


  ngOnInit(): void {
    // if (this.dynamicDialog.data) {
    //   this.demande = cloneDeep(this.dynamicDialog.data);
    // }
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
        this.showMessage({ severity: 'success', summary: 'Demande avisée avec succès' });
      }

    });

  }
   /** Permet d'afficher un modal pour aviser une demande */
   openModalValiderProjet(demande: IDemande): void {
    this.dialogService.open(ValiderProjetComponent,
    {
      header: 'Valider un projet (Profil RH) ',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: demande
    }).onClose.subscribe(result => {
      if(result){
        this.isDialogOpInProgress = false;
        this.showMessage({ severity: 'success', summary: 'Projet validé avec succès' });
      }

    });

  }
  openModalElaborerProjet(demande:IDemande): void {
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
    this.router.navigate(['detachements']);
  }

  getDemande(): void {
    this.demandeService.find(this.idDmd!).subscribe(result => {
      if (result && result.body) {
        this.demande = result.body;
        console.log("DEMANDE ========", this.demande);
        this.getPieceByDmd(this.demande.id!);
        this.getHistoriquesByDmd(this.demande.id!)
        this.isLoggedIn = !!this.tokenService.getToken();
        if (this.isLoggedIn) {
            if (this.demande.statut === 'PROJET_SIGNE') {
                this.disableExporterElaboration = false;
            }}

        console.warn("OBJET DEMANDE:::::::::::::",this.demande)
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


getHistoriquesByDmd(dmdId: number){
  this.demandeService.findHistoriquesByDemande(dmdId).subscribe(result => {
      if (result && result.body) {
          this.historiques = result.body;
          console.log("Listes historiques ======", this.historiques);
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












}
