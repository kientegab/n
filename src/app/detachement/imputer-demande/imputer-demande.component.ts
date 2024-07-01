import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { Agent, IAgent } from 'src/app/shared/model/agent.model';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { AVIS, RECEPTIONS, IHistorique, Historique } from 'src/app/shared/model/historique.model';
import { AgentService } from 'src/app/shared/service/agent.service';
import { DemandeDisponibiliteService } from 'src/app/shared/service/demande-disponibilite-service.service';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-imputer-demande',
  templateUrl: './imputer-demande.component.html',
  styleUrls: ['./imputer-demande.component.scss']
})
export class ImputerDemandeComponent {


  
  demande: IDemande = new Demande();
  @Input() data: IDemande = new Demande();
  demandes: any;
  isDialogOpInProgress: boolean | undefined;
  isOpInProgress: boolean | undefined;
  dialogErrorMessage: any;
  typeDemandeService: any;
  typeDemandes: any;
  totalRecords: number = 0;
  recordsPerPage = environment.recordsPerPage;
  agent: IAgent = new Agent();
  page = CURRENT_PAGE;

  avis = AVIS;
  receptions = RECEPTIONS;
  commentaire: string | undefined;
  historique:IHistorique = new Historique();
  historiques: IHistorique[] = []; 
  isLoggedIn = false;
  profil!: string;

  previousPage?: number;
  maxSize = MAX_SIZE_PAGE;
  //itemsPerPage = ITEMS_PER_PAGE2;
  predicate!: string;
  ascending!: boolean;
  reverse: any;
  agents: IAgent[] = [];
  selectedAgentMatricule: string | undefined;



  filtreLibelle: string | undefined;
 
  message: any;
  timeoutHandle: any;
  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
    private demandeService:DemandeService,
    private agentService: AgentService,

  ) {}

  ngOnInit(): void {
    this.loadAll();

    if (this.dynamicDialog.data) {
      this.demande = cloneDeep(this.dynamicDialog.data);
    }
  }
    
  clear(): void {
    this.dialogRef.close();
    this.dialogRef.destroy();
  }
  

  // receptions: SelectItem[] = [
  //   { label: 'conforme ', value: receptions.reception1 },
  //   { label: 'Non conforme', value: receptions.reception2 },
  // ];
 
  // Errors
  handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
  }
  
  /*
  saveImputerProjet(): void {
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    if (this.demande) {
        this.demande.historique=this.historique;
        
        this.demandeService.imputerCST(this.demande).subscribe(
          {
            next: (response: any) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'Projet vérifié avec succès' });
             
            },
            error: (error: { error: { message: any; }; }) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });

            }
          });
    }
  }*/


    saveImputerProjet(): void {
      this.clearDialogMessages();
      this.isDialogOpInProgress = true;
      if (this.demande) {
        this.demande.historique = this.historique;
        this.demande.agent = this.agent;
        console.log("l'agent à imputer",this.demande.agent.matricule)
    
        const id = this.demande.id; // Assurez-vous que `id` est défini dans `this.demande`
        console.log("Matricule de l'agent à imputer",this.selectedAgentMatricule)
        this.demande.imputerA = this.agent.matricule;
        const matriculeImputation = this.selectedAgentMatricule;
                if (id !== undefined && matriculeImputation !== undefined) {
        this.demandeService.imputerCST(id, matriculeImputation, this.demande).subscribe(
          {
            next: (response: any) => {
              this.dialogRef.close(response);
              this.dialogRef.destroy();
              this.showMessage({ severity: 'success', summary: 'Demande imputé avec succès' });
            },
            error: (error: { error: { message: any; }; }) => {
              console.error("error" + JSON.stringify(error));
              this.isOpInProgress = false;
              this.showMessage({ severity: 'error', summary: error.error.message });
            }
          }
        );
      }
      }
    }
    
  
  
 clearDialogMessages() {
    this.dialogErrorMessage = null;
  }

  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }
  
  loadTypeDemande() {
    this.typeDemandeService.findAll().subscribe((response: { body: any; }) => {

      this.typeDemandes = response.body!;
    }, (error: { error: any; }) => {
      this.message = { severity: 'error', summary: error.error };
      console.error(JSON.stringify(error));
    });
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

  sortMethod(): string[] {
    this.predicate = 'id';
    this.reverse = true;
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    return result;
  }


  loadAll(): void {
    const req = this.buildReq();
    this.agentService.query(req).subscribe(result => {
      if (result && result.body) {

        const filteredAgents = result.body.filter(agent => agent.profil?.name === "CA");
       // this.totalRecords = filteredAgents.length;
        // this.totalRecords = Number(result.headers.get('X-Total-Count'));
        console.log("RESULT",result.body);

        console.log("liste agent avec le profil",filteredAgents)

        this.agents = filteredAgents || [] ;
      }
    });
  }



  
}
