import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { AviserDetachementComponent } from '../aviser-detachement/aviser-detachement.component';
import { ReceptionDetachementComponent } from '../reception-detachement/reception-detachement.component';
import { ValiderProjetComponent } from '../valider-projet/valider-projet.component';
import {IPieceJointe} from "../../shared/model/pieceJointe.model";
import {PieceService} from "../../shared/service/piece.service";
import { IHistorique } from 'src/app/shared/model/historique.model';
import { TokenService } from 'src/app/shared/service/token.service';

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
  matricule!: string;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private demandeService: DemandeService,
    private tokenStorageService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private pieceService: PieceService,
  ) {}


  ngOnInit(): void {
    // if (this.dynamicDialog.data) {
    //   this.demande = cloneDeep(this.dynamicDialog.data);
    // }
    this.isLoggedIn = !!this.tokenStorageService.getAccessToken();

    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.matricule = user.matricule;
    }

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
      header: 'Aviser une demande (Profil SG)',
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
      header: 'Viser un projet (Profil DCMEF) ',
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
    this.router.navigate(['detachements','agents']);
  }

  getDemande(): void {
    this.demandeService.find(this.idDmd!).subscribe(result => {
      if (result && result.body) {
        this.demande = result.body;
        this.getPieceByDmd(this.demande.id!);
        this.getHistoriquesByDmd(this.demande.id!)
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
            console.log("Listes historiques ======", this.historiques);
        }
    });
}
}
