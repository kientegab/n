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
import {Message} from "primeng/api";
import {ReceptionDetachementComponent} from "../reception-detachement/reception-detachement.component";
import {Historique, IHistorique} from "../../shared/model/historique.model";
import {ValiderElaborationModalComponent} from "../valider-elaboration-modal/valider-elaboration-modal.component";
import { saveAs } from "file-saver";
import { VerifierProjetComponent } from '../verifier-projet/verifier-projet.component';
import { ViserProjetComponent } from '../viser-projet/viser-projet.component';

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

    visas: Visa[] = [];
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
    disableExporterElaboration = true

    demande: Demande = new  Demande();
    username!: string;
    profil!: string;
    idDmd?: number;
    historiques: IHistorique[] =[];
    historique:IHistorique = new Historique();


    constructor(
        private dialogService: DialogService,
        private demandeService: DemandeService,
        private tokenService: TokenService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {

        this.idDmd = +this.route.snapshot.paramMap.get('id')!;
        this.getDemande();

    }

    getDemande(): void {
        this.demandeService.find(this.idDmd!).subscribe(result => {
            if (result && result.body) {
                this.demande = result.body;
                this.ampliations = this.demande.typeDemande?.ampliations!;
                this.visas = this.demande.typeDemande?.visas!;
                this.articles = this.demande.typeDemande?.articles!;
                this.getHistoriquesByDmd(this.demande.id!);
                console.warn("DEMANDE",result.body);


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

                    if (this.demande.statut === 'DEMANDE_VALIDEE' && (this.profil === 'STDRH')) {
                        this.disableElaborer = false;
                    }

                    if (this.demande.statut === 'PROJET_ELABORE' && (this.profil === 'DRH')) {
                        this.disableValiderElaboration = false;
                    }
                    if (this.demande.statut === 'PROJET_VALIDE' && (this.profil === 'SG')) {
                        this.disableSignerElaboration = false;
                    }



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

