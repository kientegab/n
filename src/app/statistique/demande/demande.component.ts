import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, MAX_SIZE_PAGE } from 'src/app/shared/constants/pagination.constants';
import { Demande, IDemande } from 'src/app/shared/model/demande.model';
import { IStructure, Structure } from 'src/app/shared/model/structure.model';
import { ITypeDemande, TypeDemande } from 'src/app/shared/model/typeDemande.model';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { environment } from 'src/environments/environment';
import { DashbordService } from './../../shared/service/dashbord.service';
import { IStatDemande, StatDemande } from 'src/app/shared/model/statDemande';


@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent {
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
  secteurStructureSelected: IStructure = new Structure();
  structures: Structure[] = [];
  typeDemandeSelected: ITypeDemande = new TypeDemande();
  TypeDemandes: TypeDemande[] = [];
  statDemandes: IStatDemande[]=[];
  statDemande: IStatDemande= new StatDemande()
  constructor(
    private dashboardService: DashbordService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private confirmationService: ConfirmationService
  ){}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      () => {
        this.statGlobale();
      }
    );

  }
  
  statGlobale(): void{
    this.dashboardService.getNbDemande().subscribe(result => {
        if (result && result.body) {
            
            this.statDemande = result.body

            console.log("les statistiques", this.statDemande);
        }
    });   
}
}
