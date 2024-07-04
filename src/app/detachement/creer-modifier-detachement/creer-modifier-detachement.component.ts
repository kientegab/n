import {Component, Input} from '@angular/core';
import {Demande, IDemande} from "../../shared/model/demande.model";
import {ITypeDemande, TypeDemande} from "../../shared/model/typeDemande.model";
import {IPiece, Piece} from "../../shared/model/piece.model";
import {DemandeService} from "../../shared/service/demande-service.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {TypeDemandeService} from "../../shared/service/type-demande.service";
import {ConfirmationService, Message, SelectItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {IMotif, Motif} from 'src/app/shared/model/motif.model';
import {MotifService} from 'src/app/shared/service/motif.service';
import {Agent, IAgent} from 'src/app/shared/model/agent.model';
import {StructureService} from 'src/app/shared/service/structure.service';
import {AgentService} from 'src/app/shared/service/agent.service';
import {cloneDeep} from 'lodash';
import {ITypeDemandeur} from 'src/app/shared/model/typeDemandeur.model';
import {PieceService} from 'src/app/shared/service/piece.service';
import {IStructure} from 'src/app/shared/model/structure.model';
import {Duree, IDuree} from 'src/app/shared/model/duree.model';
import {UploadFileService} from 'src/app/shared/service/upload.service';
import {IPieceJointe, pieceJointe} from 'src/app/shared/model/pieceJointe.model';
import {RedirectService} from "../../shared/service/redirect.service";
import {Paiement} from "../../shared/model/paiement";
import {LigneItems} from "../../shared/model/LigneItems";
import {Store} from "../../shared/model/store";
import {Actions} from "../../shared/model/actions";
import {CustomData} from "../../shared/model/custom_data";
import {Invoice} from "../../shared/model/invoice";
import {Commande} from "../../shared/model/commande";

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-creer-modifier-detachement',
    templateUrl: './creer-modifier-detachement.component.html',
    styleUrls: ['./creer-modifier-detachement.component.scss']
})
export class CreerModifierDetachementComponent {
    demande: IDemande = new Demande();
    @Input() data: IDemande = new Demande();
    demandes: IDemande[] = [];
    error: string | undefined;
    showDialog = false;
    isDialogOpInProgress!: boolean;
    message: any;
    dialogErrorMessage: any;
    timeoutHandle: any;
    isOpInProgress!: boolean;
    pieceJointes: IPieceJointe[] = [];
    isDisplay = true;
    cloneePieces: IPieceJointe[] = [];


    pieces: IPiece[] = [];
    file: Blob | string = '';
    piecesJointes: IPieceJointe [] = [];
    fichier: Blob | string = '';

    structures: IStructure [] = [];

    selectedMotif: IMotif | undefined;
    selectedPiece: IPiece | undefined;
    multiple = true;
    motifs: IMotif[] = [];
    selectedTypeDemandeur?: ITypeDemandeur | undefined;
    idDmd: number | undefined;
    duree: IDuree = new Duree();

    typeDemandes: ITypeDemande [] = [];

    typeDemandeSelected: ITypeDemande = new TypeDemande();

    // typeDemande?: number;
    typeDemandeurs: ITypeDemandeur[] = [{
        code: 'AGENT',
        libelle: 'AGENT'
    },
        {
            code: 'STRUCTURE',
            libelle: 'STRUCTURE'
        }];

    //  }


    agent: IAgent = new Agent();


    motif: IMotif = new Motif();


    agentInfo: any; // C'est où vous stockerez les informations de l'agent
    isFetchingAgentInfo: boolean = false; // Pour gérer l'état de chargement


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    motifWithPieces: { motif: string, pieces: IPiece[] }[] = [];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    motifsFiltres: IMotif[] = [];
    piecesFilters: IPiece[] = [];
    loadPieces() {

        this.pieceService.findAll().subscribe(response => {
            this.pieces = cloneDeep(response.body!)
            // this.pieces = response.body!;
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });


    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onChangeMatricule() {
        if (this.demande.agent!.matricule) {
            this.isFetchingAgentInfo = true; // Activez l'indicateur de chargement
            console.warn("agent================================================", this.agent)
            console.warn("agent================================================", this.agentInfo)
            // Faites une requête au service pour obtenir les informations de l'agent en utilisant this.matricule
            this.agentService.getAgentInfoByMatricule(this.demande.agent!.matricule)
                .subscribe(
                    (response) => {

                        console.warn("agent================================================", this.agent)
                        console.warn("agent================================================", this.agentInfo)

                        // Vérifiez que la réponse est réussie
                        if (response && response.body) {
                            this.agent = response.body;
                            this.isFetchingAgentInfo = false; // Désactivez l'indicateur de chargement une fois les données obtenues
                            console.warn("agent================================================", this.agent)
                            console.warn("agent================================================", this.agentInfo)
                        } else {
                            console.error("Erreur lors de la récupération des informations de l'agent", response);
                            this.isFetchingAgentInfo = false; // Désactivez l'indicateur de chargement en cas d'erreur

                        }
                    },
                    (error: any) => {
                        console.error("Erreur lors de la récupération des informations de l'agent", error);
                        this.isFetchingAgentInfo = false; // Désactivez l'indicateur de chargement en cas d'erreur
                    }
                );
        } else {
            console.warn("agent================================================", this.agent)
            console.warn("agent================================================", this.agentInfo)
            // Réinitialisez les informations de l'agent si le numéro matricule est vide
            this.agent = new Agent();
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onSelectFile($event: any, piece: Piece): void {
        console.log($event.target.files[0]);
        this.file = $event.target.files[0];
        console.warn("test event===============", $event.target.files[0])
        console.warn("test piece===============", piece)
    }


    constructor(
        private demandeService: DemandeService,
        private dialogRef: DynamicDialogRef,
        private typeDemandeService: TypeDemandeService,
        private motifService: MotifService,
        private uploadService: UploadFileService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private structureService: StructureService,
        private pieceService: PieceService,
        private agentService: AgentService,
        private redirectService: RedirectService
    ) {
    }

    ngOnInit(): void {
        this.idDmd = +this.activatedRoute.snapshot.paramMap.get('id')!;
        this.loadStructure();
        this.loadPieces();
        this.loadTypeDemande();
        this.loadMotif();
        this.openCalendar();
        if(this.idDmd){
            this.getDemande();
        }
        if (!this.agent.structure) {
            this.agent.structure = {libelle: ''};
        }


        if (!this.demande.structure) {
            this.agent.structure = {libelle: ''};
        }


        if (!this.agent.superieurHierarchique) {
            this.agent.superieurHierarchique = {nom: ''};
        }


        if (!this.agent.structure.ministere) {
            this.agent.structure.ministere = {libelle: ''};
        }
        // Assurez-vous que libelle est défini
        if (!this.agent.structure.libelle) {
            this.agent.structure.libelle = '';
        }

        if (!this.demande.agent) {
            this.demande.agent = {matricule: ""};
        }
        if (!this.demande.agent) {
            this.demande.agent = {prenom: ""};
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    }

    onTypeDemandeurChange(): void {
        // this.loadMotif();
        if (this.selectedTypeDemandeur) {
            // Filtrer les motifs en fonction du typeDemandeur sélectionné
            this.motifsFiltres = this.motifs.filter((motif) => motif.typeDemandeur === this.selectedTypeDemandeur?.libelle);
            // Réinitialiser le motif sélectionné lorsque le type de demandeur change
            this.selectedMotif = undefined;
        } else {
            // Effacer la liste des motifs filtrés si aucun type de demandeur n'est sélectionné
            this.motifsFiltres = [];
            // Réinitialiser le motif sélectionné
            this.selectedMotif = undefined;
        }

    }

    onMotifChange(): void {
        if (this.selectedMotif) {
            this.piecesFilters = this.pieces.filter((piece) => piece.motif?.libelle === this.selectedMotif?.libelle);
            this.selectedPiece = undefined

        } else {

            this.piecesFilters = [];
            this.selectedPiece = undefined;
        }

    }



    displayCalendar = true;

    openCalendar() {
        this.displayCalendar = true;
    }

    loadTypeDemande() {
        this.typeDemandeService.findAll().subscribe(response => {
            this.typeDemandes = response.body!;
           console.warn("TYPE DEMANDE=================\n:",this.typeDemandes);
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }


    loadStructure() {
        this.structureService.findListe().subscribe(response => {

            this.structures = response.body!;

            console.warn("Structures================", this.structures)
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }


    loadMotif() {
        this.motifService.findAll().subscribe(response => {
            this.motifsFiltres = response.body!;
            this.motifs = cloneDeep(this.motifsFiltres)
            this.motifWithPieces = this.motifs.map((motif: IMotif) => ({
                motif: motif.libelle!,
                pieces: []
            }));
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }

    clear(): void {
        // this.form.resetForm();
        this.dialogRef.close();
        this.dialogRef.destroy();
    }

    isEditing() {
        return !!this.demande.id;
    }

    clearDialogMessages() {
        this.dialogErrorMessage = null;
    }

    // Errors
    handleError(error: HttpErrorResponse) {
        console.error(`Processing Error: ${JSON.stringify(error)}`);
        this.isDialogOpInProgress = false;
        this.dialogErrorMessage = error.error.title;
    }


    showMessage(message: Message) {
        this.message = message;
        this.timeoutHandle = setTimeout(() => {
            this.message = null;
        }, 5000);
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveEntity(): void {

        this.clearDialogMessages();
        this.isDialogOpInProgress = true;
        if (this.demande) {
            this.demande.agent = this.agent;
            // this.demande.piecesFourniesDTO= this.listePieceFournies;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.warn("ALERT ICI",this.demande);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            this.demande.duree = this.duree;
            this.demande.motif = this.selectedMotif;
            this.demande.typeDemande = this.typeDemandeSelected;
            if (this.demande.id) {
                console.warn("ALERT ICI",this.demande);
                this.demandeService.update(this.demande).subscribe(
                    {
                        next: (response) => {
                            this.dialogRef.close(response);
                            this.dialogRef.destroy();
                            this.router.navigate(['detachements']);
                            this.showMessage({severity: 'success', summary: 'demande modifié avec succès'});

                            this.isDialogOpInProgress = false;
                        },
                        error: (error) => {
                           // console.error("error" + JSON.stringify(error));
                            this.isOpInProgress = false;
                            this.isDialogOpInProgress = false;
                          //  this.showMessage({severity: 'error', summary: error.error.message});

                        }
                    });
            } else {
                this.demande.pieceJointes = this.piecesJointes;
                this.demandeService.create(this.demande).subscribe({
                    next: (response) => {
                        this.dialogRef.close(response);
                        this.dialogRef.destroy();
                        this.router.navigate(['detachements']);
                        this.showMessage({
                            severity: 'success',
                            summary: 'demande creer avec succès',

                        });
                        this.isDialogOpInProgress = false;
                    },
                    error: (error) => {
                        console.error("error" + JSON.stringify(error));
                        this.isOpInProgress = false;
                        this.isDialogOpInProgress = false;
                        this.showMessage({severity: 'error', summary: error.error.message});

                    }
                });
            }
        }
    }

    onUpload(event: UploadEvent, piece: Piece, index: number) {
        for (let file of event.files) {
            if (file) {
                this.uploadService.create(file).subscribe({
                    next: (response) => {
                        if(this.demande.id){
                            response.body!.libelle = piece.libelle;
                            response.body!.demande = this.demande.pieceJointes![index].demande
                            response.body!.id = this.demande.pieceJointes![index].id;
                            this.demande.pieceJointes![index] = response.body!;

                        }else{
                            response.body!.libelle = piece.libelle
                            this.piecesJointes[index] = response.body!;
                        }

                    },
                    error: (error) => {
                        console.error("error" + JSON.stringify(error));

                        this.showMessage({severity: 'error', summary: error.error.message});
                    }
                });
            }
        }
        console.warn("UPLOAD",this.pieceJointes);
    }

    getDemande(): void {
        this.demandeService.find(this.idDmd!).subscribe(result => {
            if (result && result.body) {
                this.demande = result.body;
                this.isDisplay = false;
                console.warn("DEMANDE::::::::::::::::::::::::::::::::::::::",this.demande);
                this.typeDemandeSelected = this.demande.typeDemande!;
                console.warn("======================== ma demande :\n",this.typeDemandeSelected);
               // this.demande.typeDemande = this.typeDemandeSelected;
                this.onChangeMatricule();
                this.duree = this.demande.duree!;
                if (this.demande.dateEffet) {
                    this.demande.dateEffet = new Date(this.demande.dateEffet)
                }
                /** charger la liste des pieces jointes */
                this.getPieceByDmd(this.demande.id!);
                /** charger typeDemandeur */
                this.selectedTypeDemandeur = this.typeDemandeurs.find(item=>item.libelle ==this.demande.motif?.typeDemandeur);
                /** charger motif,duree,agent */
                this.selectedMotif = this.demande.motif;
                this.duree = this.demande.duree!;
                this.agent = this.demande.agent!;
                this.onMotifChange();
            }
        });
    }

    getPieceByDmd(dmdId: number){
        this.demandeService.findPiecesByDemande(dmdId).subscribe(result => {
            if (result && result.body) {
                this.pieceJointes = result.body;
                this.cloneePieces = cloneDeep(result.body);
                this.demande.pieceJointes = this.pieceJointes;
                console.warn("piece recup", this.pieceJointes);
            }
        });
    }

    async voirPiece(filname?: string): Promise<void> {
        if (filname) {
            const link = await this.pieceService.visualiser(
                filname
            );
            if (link) {
                window.open(link, '_blank');
            }
        }
    }

    display(){
        this.isDisplay = true;
    }


    goToPaiement() {

        const items: LigneItems[] = []
        const item = new LigneItems();
        item.description ='Mon super produit';
        item.unit_price = 1
        item.total_price = 200;

        items.push(item);

        const store = new Store();
        store.name ='localhost:4200';
        store.website_url = "localhost:4200";

        const action = new Actions();
        action.callback_url="localhost:4200/payment-cancel";
        action.return_url="localhost:4200/payment-return";
        action.callback_url="localhost:4200/payment-callback";

        const customeData = new CustomData();
        customeData.order_id = "MonSiteOrder234";
        customeData.transaction_id = "TRNS.36887";

        const invoice = new Invoice();
        invoice.items = items;
        invoice.description = "Achat de timbre";
        invoice.devise = "XOF";
        invoice.customer_lastname = "Kabore";
        invoice.customer_email = "test@gmail.com";


        const commande = new Commande();
        commande.invoice = invoice;
        commande.actions = action;
        commande.custom_data = customeData;
        commande.store = store




        const paiement = new Paiement();

        paiement.commande = commande;
        console.warn("json",paiement)


        const url = 'https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/create'; // Target URL
        const data = paiement;
        const headers = {
            'ApiKey': 'V5T3Z0O594C6QNZ4L',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF9hcHAiOiIxODI0OSIsImlkX2Fib25uZSI6ODk5NDIsImRhdGVjcmVhdGlvbl9hcHAiOiIyMDI0LTA3LTA0IDE1OjA2OjE2In0.MPR-WGFdX3PoBAH8IbMreF6AENu2DImrcRzTuiznjXY',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        this.redirectService.redirectPaiement(url, data, headers);
    }
}
