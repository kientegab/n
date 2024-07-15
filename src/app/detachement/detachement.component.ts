import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, Message } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from '../shared/constants/pagination.constants';
import { IDemande, Demande } from '../shared/model/demande.model';
import { DemandeService } from '../shared/service/demande-service.service';
import { ValiderProjetComponent } from './valider-projet/valider-projet.component';
import {TokenService} from "../shared/service/token.service";
import {Actions, Commande, CustomData, Invoice, Item, Paiement, Store} from "../shared/model/paiement/paiementDto";
import {RedirectService} from "../shared/service/redirect.service";
import {ITransaction, Transaction} from "../shared/model/paiement/transactionDto";

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
  enableBtnPaiement = true;
  enableBtnEdit = true;
  enableBtnDelete=false;
  enableBtnValider=true;
  enableBtnAbandonner=true;
  enableBtnRecipisse=true;
  enableBtnDownload=true;

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
  paiementComplete = false



  constructor(
    private demandeService: DemandeService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private tokenStorage: TokenService,
    private redirectService: RedirectService
  ){}


  ngOnInit(): void {
      if(localStorage.getItem('token')){
          //verifier si la transaction s'est bien passée
          this.getTransaction(localStorage.getItem('token')!);
          
      }
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

  generateRecipisse(demande: IDemande): void {
    if (demande.id !== undefined) {
      this.demandeService.generateRecipisse(demande.id).subscribe(
        (response: Blob) => {
          const file = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        },
        (error) => {
          console.error('Erreur lors de la génération du récépissé : ', error);
          // Gérer les erreurs ici...
        }
      );
    } else {
      console.error('ID de demande non défini.');
      // Gérer le cas où ID est undefined (optionnel)
    }

  }
  downloadActe(demande: IDemande): void {
    if (demande.id !== undefined) {
      this.demandeService.downloadActe(demande.id).subscribe(
        (response: Blob) => {
          const file = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        },
        (error) => {
          console.error('Erreur lors de la génération du récépissé : ', error);
          // Gérer les erreurs ici...
        }
      );
    } else {
      console.error('ID de demande non défini.');
      // Gérer le cas où ID est undefined (optionnel)
    }
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

  //Abandonner
  onAbandonner(demande: IDemande) {
    this.confirmationService.confirm({
      message: 'Etes-vous sur de vouloir abandonner cette demande?',
      accept: () => {
        this.abandonner(demande);
      }
    });
  }

  abandonner(selection: any) {
    this.isOpInProgress = true;
    this.demandeService.abandonner(selection.id).subscribe(() => {
      this.demandes = this.demandes.filter(demande => demande.id !== selection.id);
      selection = null;
      this.isOpInProgress = false;
      this.totalRecords--;
      this.showMessage({
        severity: 'success',
        summary: 'Demande abandonner avec succès',
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


  isEditButtonVisible(demande: any): boolean {
    return demande.statut === 'REJET_CA';
  }

  goToPaiement(demande: IDemande) {
    const items: Item[] = []
    const item = new Item();
    item.description ='Mon super produit';
    item.unit_price = 200
    item.total_price = 200;
    item.name = "Timbre";
    item.quantity= 1

    items.push(item);

    const store = new Store();
    store.name ='eDAC';
    store.website_url = "localhost:4200";

    const action = new Actions();
    action.callback_url="http://localhost:8081/api/detachements/paiement/callback";
    action.return_url="http://localhost:4200/detachements";
    action.cancel_url="http://localhost:4200"

    const customeData = new CustomData();
    customeData.order_id = "eDac";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    customeData.transaction_id = result;

    const invoice = new Invoice();
    invoice.items = items;
    invoice.total_amount= 100;
    invoice.description = "Achat de timbre";
    invoice.devise = "XOF";
    invoice.customer_lastname = "Kabore";
    invoice.customer_firstname = "Ali";
    invoice.customer_email = "test@gmail.com";
    const ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    const charLengh = ch.length;
    for (let i = 0; i < 10; i++) {
        res += characters.charAt(Math.floor(Math.random() * charLengh));
    }
    invoice.transaction_id = demande.id?.toString();
    invoice.external_id = demande.id?.toString();


    const commande = new Commande();
    commande.invoice = invoice;
    commande.actions = action;
    commande.custom_data = customeData;
    commande.store = store;

    const paiement = new Paiement();

    paiement.commande = commande;


    const url = 'https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/create'; // Target URL
    const data = paiement;
    const headers = new HttpHeaders({
        'ApiKey': 'V5T3Z0O594C6QNZ4L',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF9hcHAiOiIxODI0OSIsImlkX2Fib25uZSI6ODk5NDIsImRhdGVjcmVhdGlvbl9hcHAiOiIyMDI0LTA3LTA0IDE1OjA2OjE2In0.MPR-WGFdX3PoBAH8IbMreF6AENu2DImrcRzTuiznjXY',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });


    this.redirectService.postWithHeaders(url, paiement, headers).subscribe(response => {
        console.warn("RESP",response);
        // enregistrer le token
        localStorage.setItem('token',response.token);
        window.location.href = response.response_text;
        //this.getTransaction(response.token, urlRedirect);

        //
    }, error => {
        console.error('Error:', error);
    });
}

   

    saveTransaction(transaction: ITransaction){
        this.redirectService.createTransaction(transaction).subscribe(response => {
            console.warn("RESP",response);
            // effacer le token
            localStorage.removeItem('token');

        }, error => {
            console.error('Error:', error);
        });
    }

    private getTransaction(token: string) {
        this.redirectService.getTransaction(token).subscribe(response => {
            if(response.body!.response_code == "00" && response.body!.status == "completed" ){
              this.paiementComplete=true;
                this.saveTransaction(response.body!);
            }
        }, error => {
            console.error('Error:', error);
        });
    }
}
