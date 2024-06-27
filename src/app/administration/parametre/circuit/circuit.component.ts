import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { Circuit, ICircuit } from 'src/app/shared/model/circuit.model';
import { CircuitService } from 'src/app/shared/service/circuit.service';
import { environment } from 'src/environments/environment';
import { CreerModifierCircuitComponent } from './creer-modifier-circuit/creer-modifier-circuit.component';

@Component({
  selector: 'app-circuit',
  templateUrl: './circuit.component.html',
  styleUrls: ['./circuit.component.scss']
})
export class CircuitComponent {
  
  routeData: Subscription | undefined;
  communeListSubscription: Subscription | undefined;
  circuits: ICircuit[] = [];
  circuit: ICircuit = new Circuit();
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
    private circuitService: CircuitService,
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
          if (this.communeListSubscription) {
            this.communeListSubscription.unsubscribe();
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
        this.circuitService.findAll().subscribe(result => {
          if (result && result.body) {
            this.totalRecords = Number(result.headers.get('X-Total-Count'));
            this.circuits = result.body || [];
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
      this.dialogService.open(CreerModifierCircuitComponent,
        {
          header: 'Ajouter un circuit',
          width: '60%',
          contentStyle: { overflow: 'auto', },
          baseZIndex: 10000,
          maximizable: true,
          closable: true,
        }
      ).onClose.subscribe(result => {
        if(result) {
        this.circuits.push(result);
        this.loadAll();
        this.isDialogOpInProgress = false;
        this.showMessage({ severity: 'success', summary: 'Circuit créée avec succès' });
        }
      });
    }

    /** Permet d'afficher un modal pour la modification */
    openModalEdit(circuit: ICircuit): void {
      this.dialogService.open(CreerModifierCircuitComponent,
        {
          header: 'Modifier un circuit',
          width: '60%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          closable: true,
          data: circuit
        }).onClose.subscribe(result => {
          if(result){
            this.loadAll();
            this.isDialogOpInProgress = false;
            this.showMessage({ severity: 'success', summary: 'Circuit modifiée avec succès' });
          }
         
        });

    }

    /** Permet d'afficher un modal pour voir les détails */
    openModalDetail(circuit:ICircuit): void {
      this.dialogService.open(CreerModifierCircuitComponent,
        {
          header: 'Details de circuit',
          width: '60%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          data: circuit
        });
    }


    // Deletion
    onDelete(circuit: ICircuit) {
      this.confirmationService.confirm({
        message: 'Etes-vous sur de vouloir supprimer ce circuit?',
        accept: () => {
          this.delete(circuit);
        }
      });
    }

    delete(selection: any) {
      this.isOpInProgress = true;
      this.circuitService.delete(selection.id).subscribe(() => {
        this.circuits = this.circuits.filter(circuit => circuit.id !== selection.id);
        selection = null;
        this.isOpInProgress = false;
        this.totalRecords--;
        this.showMessage({
          severity: 'success',
          summary: 'Circuit supprimée avec succès',
        });
      }, (error) => {
        console.error("circuit " + JSON.stringify(error));
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
