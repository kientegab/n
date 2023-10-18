import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, Message } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CreerModifierDisponibiliteComponent } from 'src/app/disponibilite/creer-modifier-disponibilite/creer-modifier-disponibilite.component';
import { DetailsDisponibiliteComponent } from 'src/app/disponibilite/details-disponibilite/details-disponibilite.component';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { environment } from 'src/environments/environment';
import { ValiderProjetComponent } from '../valider-projet/valider-projet.component';

@Component({
  selector: 'app-detachement-agents',
  templateUrl: './detachement-agents.component.html',
  styleUrls: ['./detachement-agents.component.scss']
})
export class DetachementAgentsComponent {

  routeData: Subscription | undefined;
  demandeListSubscription: Subscription | undefined;
  demandes: IDemande[] = [];
  demande: IDemande = new Demande();
  timeoutHandle: any;
  totalRecords: number = 0;
  recordsPerPage = environment.recordsPerPage;
  enableBtnInfo = true;
  enableBtnEdit = true;
  enableBtnDelete = true;
  enableBtnValider=false;
  isLoading!: boolean;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  regionDetail: boolean=false;
  message: any;
  dialogErrorMessage: any;
  enableCreate = true;

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
        this.demandeService.query(req).subscribe(result => {
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

      /** Permet d'afficher un modal pour la modification */
      openModalEdit(demande: IDemande): void {
        this.dialogService.open(CreerModifierDisponibiliteComponent,
          {
            header: 'Modifier un demande',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: demande
          }).onClose.subscribe(result => {
            if(result){
              this.isDialogOpInProgress = false;
              this.loadAll();
              this.showMessage({ severity: 'success', summary: 'Demande modifiée avec succès' });
            }

          });

      }

      openModalDetailAgent(demande:IDemande): void {
        this.router.navigate(['detachements','details-ags', demande.id]);
      }
      
     

      // Errors
      handleError(error: HttpErrorResponse) {
        console.error(`Processing Error: ${JSON.stringify(error)}`);
        this.isDialogOpInProgress = false;
        this.dialogErrorMessage = error.error.title;
      }
      openModalValiderProjet(demande: IDemande): void {
        this.dialogService.open(ValiderProjetComponent,
        {
          header: 'Vérifier un projet d\'arreté (Profil ST DCMEF) ',
          width: '60%',
          height: '60%',
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
