import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from '../shared/constants/pagination.constants';
import { IDemande, Demande } from '../shared/model/demande.model';
import { DemandeService } from '../shared/service/demande-service.service';
import { CreerModifierDetachementComponent } from './creer-modifier-detachement/creer-modifier-detachement.component';
import { DetailsDetachementComponent } from './details-detachement/details-detachement.component';
import { ValiderProjetComponent } from './valider-projet/valider-projet.component';
import {TokenService} from "../shared/service/token.service";

@Component({
  selector: 'app-detachement',
  templateUrl: './detachement.component.html',
  styleUrls: ['./detachement.component.scss']
})
export class DetachementComponent {

  routeData: Subscription | undefined;
  demandeListSubscription: Subscription | undefined;
  demandes: IDemande[] = [];
  demande: IDemande = new Demande();
  timeoutHandle: any;
  totalRecords: number = 0;
  recordsPerPage = environment.recordsPerPage;
  enableBtnInfo = true;
  enableBtnEdit = true;
  enableBtnDelete=true;
  enableBtnValider=true;
  isLoading!: boolean;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  regionDetail: boolean=false;
  message: any;
  dialogErrorMessage: any;
  enableCreate = true;
  enableInfo = true;
  page = CURRENT_PAGE;
  previousPage?: number;
  maxSize = MAX_SIZE_PAGE;
  //itemsPerPage = ITEMS_PER_PAGE2;
  predicate!: string;
  ascending!: boolean;
  reverse: any;

  filtreNumero: string | undefined;
  items: MenuItem[] = [];



  constructor(
    private demandeService: DemandeService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private tokenStorage: TokenService,
  ){}


  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      () => {
        //this.loadAll();
          this.loadMesDemandes();
      }
    );

  }

  ngOnDestroy(): void {
    if (this.routeData) {
      this.routeData.unsubscribe();
      if (this.demandeListSubscription) {
        this.demandeListSubscription.unsubscribe();
      }
    }
  }

  filtrer(): void {
   // this.loadAll();
      this.loadMesDemandes();
  }

  resetFilter(): void {
    this.filtreNumero = undefined;
    this.filtrer();
  }

  loadPage(event:any): void {
    if(event){
      this.page = event.first/event.rows + 1;
      this.recordsPerPage = event.rows;
    }
    this.transition();
  }

  transition(): void {
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    });
   // this.loadAll();
      this.loadMesDemandes();
  }

 /* loadAll(): void {
    const req = this.buildReq();
    console.warn("USER-CONNECTED",this.tokenStorage.getUser())
    this.demandeService.query(req).subscribe(result => {
      if (result && result.body) {
        this.totalRecords = Number(result.headers.get('X-Total-Count'));
        this.demandes = result.body || [];
        console.log("====== demandes =======", this.demandes);
      }
    });
  }*/

    loadMesDemandes(): void {
        const req = this.buildReq();
        this.demandeService.findMyDmds(req,this.tokenStorage.getUser().matricule).subscribe(result => {
            if (result && result.body) {
                this.totalRecords = Number(result.headers.get('X-Total-Count'));
                this.demandes = result.body || [];
                console.log("====== demandes personnelles =======", this.demandes);
            }
        });
    }


  sortMethod(): string[] {
    this.predicate = 'id';
    this.reverse = true;
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    return result;
  }

  buildReq(): any {
    let req = {
      page: this.page -1,
      size: this.recordsPerPage,
      sort: this.sortMethod(),
    };
    let obj : any;
    if (this.filtreNumero) {
      obj = {};
      obj['libelle.contains'] = this.filtreNumero;
      req = Object.assign({}, req, obj);
    }
    return req;
  }

  /** Permet d'afficher une page pour l'ajout */
  openModalCreate(): void {
      this.router.navigate(['detachements','nouveau']);
  }

  /** Permet d'afficher une page pour la modification */
  openModalEdit(demande: IDemande): void {
    this.router.navigate(['detachements','edit', demande.id]);

  }

  /** Permet d'afficher une page pour voir les détails */
  openModalDetail(demande:IDemande): void {
    this.router.navigate(['detachements','details', demande.id]);
  }



  // Deletion
  onDelete(demande: IDemande) {
    this.confirmationService.confirm({
      message: 'Etes-vous sur de vouloir supprimer cette demande?',
      accept: () => {
        this.delete(demande);
      }
    });
  }

  delete(selection: any) {
    this.isOpInProgress = true;
    this.demandeService.delete(selection.id).subscribe(() => {
      this.demandes = this.demandes.filter(demande => demande.id !== selection.id);
      selection = null;
      this.isOpInProgress = false;
      this.totalRecords--;
      this.showMessage({
        severity: 'success',
        summary: 'Demande supprimée avec succès',
      });
    }, (error) => {
      console.error("demande " + JSON.stringify(error));
      this.isOpInProgress = false;
      this.showMessage({ severity: 'error', summary: error.error.message });
    });
  }
  // Errors
  handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
  }
  // Messages

  clearDialogMessages() {
    this.dialogErrorMessage = null;
  }

      /** Permet d'afficher un modal pour aviser une demande */
   openModalValiderProjet(demande: IDemande): void {
    this.dialogService.open(ValiderProjetComponent,
    {
      header: 'Valider un projet (Profil DCMEF) ',
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

  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

}
