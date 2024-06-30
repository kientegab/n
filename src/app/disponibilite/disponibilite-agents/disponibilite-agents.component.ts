import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { environment } from 'src/environments/environment';
import { CreerModifierDisponibiliteComponent } from '../creer-modifier-disponibilite/creer-modifier-disponibilite.component';
import { DetailsDisponibiliteComponent } from '../details-disponibilite/details-disponibilite.component';
import { AviserDisponibiliteComponent } from '../aviser-disponibilite/aviser-disponibilite.component';
import {IMotif} from "../../shared/model/motif.model";
import {ITypeDemandeur} from "../../shared/model/typeDemandeur.model";
import {DemandeDisponibiliteService} from "../../shared/service/demande-disponibilite-service.service";

@Component({
  selector: 'app-disponibilite-agents',
  templateUrl: './disponibilite-agents.component.html',
  styleUrls: ['./disponibilite-agents.component.scss']
})
export class DisponibiliteAgentsComponent {

  routeData: Subscription | undefined;
  demandeListSubscription: Subscription | undefined;
  demandes: IDemande[] = [];
  demande: IDemande = new Demande();
  timeoutHandle: any;
  totalRecords: number = 0;
  recordsPerPage = environment.recordsPerPage;
  enableBtnInfo = true;
  isLoading!: boolean;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  regionDetail: boolean=false;
  message: any;
  dialogErrorMessage: any;
  page = CURRENT_PAGE;
  previousPage?: number;
  maxSize = MAX_SIZE_PAGE;
  predicate!: string;
  ascending!: boolean;
  reverse: any;
  enableCreate = true;
  filtreNumero: string | undefined;
  items: MenuItem[] = [];


  constructor(
    private demandeService: DemandeDisponibiliteService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router
    ){}

   ngOnInit(): void {
        this.activatedRoute.data.subscribe(
          () => {
            this.loadAll();
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
        this.loadAll();
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
        this.loadAll();
      }

      loadAll(): void {
        const req = this.buildReq();
        this.demandeService.findDemandesAgents(req).subscribe(result => {
          if (result && result.body) {
            this.totalRecords = Number(result.headers.get('X-Total-Count'));
            this.demandes = result.body || [];
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

      /** Permet d'afficher un modal pour voir les détails */
      openModalDetail(demande:IDemande): void {
        this.dialogService.open(DetailsDisponibiliteComponent,
          {
            header: 'Details de demande',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: demande
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
