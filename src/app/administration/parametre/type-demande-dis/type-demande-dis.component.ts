import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { ITypeDemande, TypeDemande } from 'src/app/shared/model/typeDemande.model';
import { TypeDemandeService } from 'src/app/shared/service/type-demande.service';
import { environment } from 'src/environments/environment';
import { CreerModifierTypeDemandeComponent } from '../type-demande/creer-modifier-type-demande/creer-modifier-type-demande.component';
import { DetailTypeDemandeComponent } from '../type-demande/detail-type-demande/detail-type-demande.component';
import { CreerModifierTdemandeDisComponent } from './creer-modifier-tdemande-dis/creer-modifier-tdemande-dis.component';
import { DetailTdemandeDisComponent } from './detail-tdemande-dis/detail-tdemande-dis.component';

@Component({
  selector: 'app-type-demande-dis',
  templateUrl: './type-demande-dis.component.html',
  styleUrls: ['./type-demande-dis.component.scss']
})
export class TypeDemandeDisComponent {
  routeData: Subscription | undefined;
  typeDemandeListSubscription: Subscription | undefined;
  typeDemandes: ITypeDemande[] = [];
  typeDemande: ITypeDemande = new TypeDemande();
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
  predicate!: string;
  ascending!: boolean;
  reverse: any;

  filtreLibelle: string | undefined;
  items: MenuItem[] = [];



  constructor(
      private activatedRoute: ActivatedRoute,
      private dialogService: DialogService,
      private dialogRef: DynamicDialogRef,
      private router: Router,
      private confirmationService: ConfirmationService,
      private typeDemandeService: TypeDemandeService
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
          if (this.typeDemandeListSubscription) {
              this.typeDemandeListSubscription.unsubscribe();
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
      this.typeDemandeService.queryDis(req).subscribe(result => {
          if (result && result.body) {
              this.totalRecords = Number(result.headers.get('X-Total-Count'));
              this.typeDemandes = result.body || [];
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
  /** Permet d'afficher un modal pour l'ajout */
  openModalCreate(): void {
      this.dialogService.open(CreerModifierTdemandeDisComponent,
          {
              header: 'Ajouter une type Demande',
              width: '60%',
              contentStyle: { overflow: 'auto', },
              baseZIndex: 10000,
              maximizable: true,
              closable: true,
          }
      ).onClose.subscribe(result => {
          if(result) {
              this.typeDemandes.push(result);
              this.isDialogOpInProgress = false;
              this.showMessage({ severity: 'success', summary: 'type de demande créée avec succès' });
          }
      });
  }

  /** Permet d'afficher un modal pour la modification */
  openModalEdit(typeDemande: ITypeDemande): void {
      this.dialogService.open(CreerModifierTdemandeDisComponent,
          {
              header: 'Modifier un type demande',
              width: '60%',
              contentStyle: { overflow: 'auto' },
              baseZIndex: 10000,
              maximizable: true,
              closable: true,
              data: typeDemande
          }).onClose.subscribe(result => {
          if(result){
              this.isDialogOpInProgress = false;
              this.loadAll();
              this.showMessage({ severity: 'success', summary: 'type de demande modifiée avec succès' });
          }

      });

  }

  /** Permet d'afficher un modal pour voir les détails */
  openModalDetail(typeDemande:ITypeDemande): void {
      this.dialogService.open(DetailTdemandeDisComponent,
          {
              header: 'Details de typeDemande',
              width: '60%',
              contentStyle: { overflow: 'auto' },
              baseZIndex: 10000,
              maximizable: true,
              data: typeDemande
          });
  }


  // Deletion
  onDelete(typeDemande: ITypeDemande) {
      this.confirmationService.confirm({
          message: 'Etes-vous sur de vouloir supprimer ce type de demande?',
          accept: () => {
              this.delete(typeDemande);
          }
      });
  }

  delete(selection: any) {
      this.isOpInProgress = true;
      this.typeDemandeService.delete(selection.id).subscribe(() => {
          this.typeDemandes = this.typeDemandes.filter(typeDemande => typeDemande.id !== selection.id);
          selection = null;
          this.isOpInProgress = false;
          this.totalRecords--;
          this.showMessage({
              severity: 'success',
              summary: 'Type demande supprimé avec succès',
          });
      }, (error) => {
          console.error("typeDemande " + JSON.stringify(error));
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
