import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { IMotifDisponibilite, MotifDisponibilite } from 'src/app/shared/model/motifDisponibilite.model';
import { MotifDisponibiliteService } from 'src/app/shared/service/motif-disponibilite.service';
import { environment } from 'src/environments/environment';
import { CreerModifierMotifDisponibiliteComponent } from './creer-modifier-motif-disponibilite/creer-modifier-motif-disponibilite.component';
import { DetailsMotifDisponibiliteComponent } from './details-motif-disponibilite/details-motif-disponibilite.component';

@Component({
  selector: 'app-motif-disponibilite',
  templateUrl: './motif-disponibilite.component.html',
  styleUrls: ['./motif-disponibilite.component.scss']
})
export class MotifDisponibiliteComponent {
 
  routeData: Subscription | undefined;
  MotifListSubscription: Subscription | undefined;
  MotifsDisponibilite: IMotifDisponibilite[] = [];
  MotifDisponibilite: IMotifDisponibilite = new MotifDisponibilite();
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

  page = CURRENT_PAGE;
  previousPage?: number;
  maxSize = MAX_SIZE_PAGE;
  //itemsPerPage = ITEMS_PER_PAGE2;
  predicate!: string;
  ascending!: boolean;
  reverse: any;

  filtreLibelle: string | undefined;
  items: MenuItem[] = [];



  constructor(
    private motifDisponibiliteService: MotifDisponibiliteService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private dialogRef: DynamicDialogRef,
    private router: Router,
    private confirmationService: ConfirmationService
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
          if (this.MotifListSubscription) {
            this.MotifListSubscription.unsubscribe();
          }
        }
      }

      filtrer(): void {
        this.loadAll();
      }

      resetFilter(): void {
        this.filtreLibelle = undefined;
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
        this.motifDisponibiliteService.query(req).subscribe(result => {
          if (result && result.body) {
            this.totalRecords = Number(result.headers.get('X-Total-Count'));
            this.MotifsDisponibilite = result.body || [];
            console.warn("X-Total-Count",this.MotifsDisponibilite);
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
        if (this.filtreLibelle) {
          obj = {};
          obj['libelle.contains'] = this.filtreLibelle;
          req = Object.assign({}, req, obj);
        }
        return req;
      }

      // load(event?: LazyLoadEvent): void {
      //   this.isLoading = true;
      //   this.MotifService.findAll(event).subscribe(
      //     {
      //       next: (result) => {
      //         if (result && result.body) {
      //           this.isLoading = false;
      //           this.MotifsDisponibilite = result.body!;
      //         }
      //       },
      //       error: (reason) => {
      //         this.message = { severity: 'error', summary: reason.error };
      //         console.error(JSON.stringify(reason));
      //       }
      //     });
      // }

      /** Permet d'afficher un modal pour l'ajout */
      openModalCreate(): void {
        this.dialogService.open(CreerModifierMotifDisponibiliteComponent,
          {
            header: 'Ajouter une MotifDisponibilite',
            width: '60%',
            contentStyle: { overflow: 'auto', },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
          }
        ).onClose.subscribe(result => {
          if(result) {
          this.MotifsDisponibilite.push(result);
          this.loadAll();
          this.isDialogOpInProgress = false;
          this.showMessage({ severity: 'success', summary: 'MotifDisponibilite créée avec succès' });
          }
        });
      }

      /** Permet d'afficher un modal pour la modification */
      openModalEdit(MotifDisponibilite: IMotifDisponibilite): void {
        this.dialogService.open(CreerModifierMotifDisponibiliteComponent,
          {
            header: 'Modifier un MotifDisponibilite',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: MotifDisponibilite
          }).onClose.subscribe(result => {
            if(result){
              this.isDialogOpInProgress = false;
              this.loadAll();
              this.showMessage({ severity: 'success', summary: 'MotifDisponibilite modifiée avec succès' });
            }

          });

      }

      /** Permet d'afficher un modal pour voir les détails */
      openModalDetail(MotifDisponibilite:IMotifDisponibilite): void {
        this.dialogService.open(DetailsMotifDisponibiliteComponent,
          {
            header: 'Details de MotifDisponibilite',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: MotifDisponibilite
          });
      }


      // Deletion
      onDelete(MotifDisponibilite: IMotifDisponibilite) {
        this.confirmationService.confirm({
          message: 'Etes-vous sur de vouloir supprimer ce MotifDisponibilite?',
          accept: () => {
            this.delete(MotifDisponibilite);
          }
        });
      }

      delete(selection: any) {
        this.isOpInProgress = true;
        this.motifDisponibiliteService.delete(selection.id).subscribe(() => {
          this.MotifsDisponibilite = this.MotifsDisponibilite.filter(MotifDisponibilite => MotifDisponibilite.id !== selection.id);
          selection = null;
          this.isOpInProgress = false;
          this.totalRecords--;
          this.showMessage({
            severity: 'success',
            summary: 'MotifDisponibilite supprimée avec succès',
          });
        }, (error) => {
          console.error("MotifDisponibilite " + JSON.stringify(error));
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
