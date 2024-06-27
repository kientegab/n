import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { IProfil, Profil } from 'src/app/shared/model/profil-old';
import { ProfilService } from 'src/app/shared/service/profil.service';
import { environment } from 'src/environments/environment';
import { CreerModifierProfilComponent } from './creer-modifier-profil/creer-modifier-profil.component';
import { DetailsProfilComponent } from './details-profil/details-profil.component';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  routeData: Subscription | undefined;
  profilListSubscription: Subscription | undefined;
  profils: IProfil[] = [];
  profil: IProfil = new Profil();
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
    private profilService: ProfilService,
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
          if (this.profilListSubscription) {
            this.profilListSubscription.unsubscribe();
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
        this.profilService.query(req).subscribe(result => {
          if (result && result.body) {
            this.totalRecords =result.body.length;
            // this.totalRecords = Number(result.headers.get('X-Total-Count'));
            this.profils = result.body || [];
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
        this.dialogService.open(CreerModifierProfilComponent,
          {
            header: 'Ajouter un profil',
            width: '60%',
            contentStyle: { overflow: 'auto', },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
          }
        ).onClose.subscribe(result => {
          if(result) {
          this.profils.push(result);
          this.loadAll();
          this.isDialogOpInProgress = false;
          this.showMessage({ severity: 'success', summary: 'Profil créé avec succès' });
          }
        });
      }

      /** Permet d'afficher un modal pour la modification */
      openModalEdit(profil: IProfil): void {
        this.dialogService.open(CreerModifierProfilComponent,
          {
            header: 'Modifier un profil',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            closable: true,
            data: profil
          }).onClose.subscribe(result => {
            if(result){
              this.isDialogOpInProgress = false;
              this.loadAll();
              this.showMessage({ severity: 'success', summary: 'Profil modifié avec succès' });
            }

          });

      }

      /** Permet d'afficher un modal pour voir les détails */
      openModalDetail(profil:IProfil): void {
        this.dialogService.open(DetailsProfilComponent,
          {
            header: 'Details du profil',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: profil
          });
      }


      // Deletion
      onDelete(profil: IProfil) {
        this.confirmationService.confirm({
          message: 'Etes-vous sur de vouloir supprimer ce profil?',
          accept: () => {
            this.delete(profil);
          }
        });
      }

      delete(selection: any) {
        this.isOpInProgress = true;
        this.profilService.delete(selection.id).subscribe(() => {
          this.profils = this.profils.filter(profil => profil.id !== selection.id);
          selection = null;
          this.isOpInProgress = false;
          this.totalRecords--;
          this.showMessage({
            severity: 'success',
            summary: 'Profil supprimé avec succès',
          });
        }, (error) => {
          console.error("profil " + JSON.stringify(error));
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
