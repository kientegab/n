import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from '../shared/constants/pagination.constants';
import { IDemande, Demande } from '../shared/model/demande.model';
import { DemandeService } from '../shared/service/demande-service.service';
import { CreerModifierDisponibiliteComponent } from './creer-modifier-disponibilite/creer-modifier-disponibilite.component';
import { DetailsDisponibiliteComponent } from './details-disponibilite/details-disponibilite.component';
import { IAgent } from '../shared/model/agent.model';
import {DemandeDisponibiliteService} from "../shared/service/demande-disponibilite-service.service";
import { TokenService } from '../shared/service/token.service';

@Component({
  selector: 'app-disponibilite',
  templateUrl: './disponibilite.component.html',
  styleUrls: ['./disponibilite.component.scss']
})
export class DisponibiliteComponent {

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
  isLoading!: boolean;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  regionDetail: boolean=false;
  message: any;
  dialogErrorMessage: any;
  enableCreate = true;
  agents: IAgent[] = [];
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
    private demandeService: DemandeDisponibiliteService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private dialogRef: DynamicDialogRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private tokenStorage: TokenService
    ){}


   ngOnInit(): void {
        this.activatedRoute.data.subscribe(
          () => {
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
        this.loadMesDemandes();
      }




      loadMesDemandes(): void {
        const req = this.buildReq();
        this.demandeService.findMyDmds(req,this.tokenStorage.getUser().matricule).subscribe(result => {
            if (result && result.body) {
                this.totalRecords = Number(result.headers.get('X-Total-Count'));
                this.demandes = result.body || [];
                console.log("====== demandes personnelles =======", result);
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

      /** Permet d'afficher un modal pour l'ajout */
      openModalCreate(): void {
        this.router.navigate(['disponibilites','nouveau']);
      }

      /** Permet d'afficher un modal pour la modification */
      openModalEdit(demande: IDemande): void {
          this.router.navigate(['disponibilites','edit', demande.id]);

      }

      /** Permet d'afficher un modal pour voir les détails */
      openModalDetail(demande:IDemande): void {
        // this.router.navigate(['disponibilites','details']);
        this.dialogService.open(DetailsDisponibiliteComponent,
          {
            header: 'Details de la demande',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: demande
          });
      }


      // Deletion
      onDelete(demande: IDemande) {
        this.confirmationService.confirm({
          message: 'Etes-vous sur de vouloir supprimer ce demande?',
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

      showMessage(message: Message) {
        this.message = message;
        this.timeoutHandle = setTimeout(() => {
          this.message = null;
        }, 5000);
      }

}
