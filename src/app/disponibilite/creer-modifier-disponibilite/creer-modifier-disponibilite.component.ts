import {HttpErrorResponse} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {Message} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Agent, IAgent} from 'src/app/shared/model/agent.model';
import {Demande, IDemande} from 'src/app/shared/model/demande.model';
import {IMotif} from 'src/app/shared/model/motif.model';
import {IPiece, Piece} from 'src/app/shared/model/piece.model';

import {ITypeDemande, TypeDemande} from 'src/app/shared/model/typeDemande.model';
import {AgentService} from 'src/app/shared/service/agent.service';
import {DemandeService} from 'src/app/shared/service/demande-service.service';
import {MotifService} from 'src/app/shared/service/motif.service';
import {StructureService} from 'src/app/shared/service/structure.service';
import {TypeDemandeService} from 'src/app/shared/service/type-demande.service';
import {ITypeDemandeur} from "../../shared/model/typeDemandeur.model";
import {Duree, IDuree} from "../../shared/model/duree.model";
import {IPieceJointe} from "../../shared/model/pieceJointe.model";
import {PieceService} from "../../shared/service/piece.service";
import {IStructure} from "../../shared/model/structure.model";
import {UploadFileService} from "../../shared/service/upload.service";
import {cloneDeep} from "lodash";

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'app-creer-modifier-disponibilite',
    templateUrl: './creer-modifier-disponibilite.component.html',
    styleUrls: ['./creer-modifier-disponibilite.component.scss']
})
export class CreerModifierDisponibiliteComponent implements OnInit{


    agentInfo: any; // C'est où vous stockerez les informations de l'agent
    isFetchingAgentInfo: boolean = false; // Pour gérer l'état de chargement
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
    typeDemandes: ITypeDemande[] = [];
    pieces: IPiece[] = [];
    file: Blob | string = '';
    motifs: IMotif[] = [];
    agent: IAgent = new Agent();
    numeroMatricule: string = '';
    selectedMotif: IMotif | undefined;
    multiple = true;
    motifWithPieces: { motif: string, pieces: IPiece[] }[] = [];
    selectedTypeDemandeur?: ITypeDemandeur | undefined;
    motifsFiltres: IMotif[] = [];
    piecesFilters: IPiece[] = [];
    typeDemandeSelected: ITypeDemande = new TypeDemande();
    duree: IDuree = new Duree();
    pieceJointes: IPieceJointe[] = [];
    isDisplay= false;
    structures: IStructure [] = [];
    piecesJointes: IPieceJointe [] = [];
    typeDemandeurs: ITypeDemandeur[] = [{
        code: 'AGENT',
        libelle: 'AGENT'
    },
    ];
    matricule?:string;
    idDmd?:number;


    constructor(
        private demandeService: DemandeService,
        private dialogRef: DynamicDialogRef,
        private typeDemandeService: TypeDemandeService,
        private motifService: MotifService,
        private agentService: AgentService,
        private structureService: StructureService,
        private pieceService: PieceService,
        private uploadService: UploadFileService,
    ) {
    }


    ngOnInit(): void {

        if (!this.agent.structure) {
            this.agent.structure = {libelle: ''};
        }

        // Assurez-vous que libelle est défini
        if (!this.agent.structure.libelle) {
            this.agent.structure.libelle = '';
        }
        this.loadTypeDemande();
        this.loadPieces();
        this.loadMotif();
        this.loadStructure();
        this.openCalendar();
        this.initObjet();

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
    onMotifChange() {

    }

    onFileChange(event: any, pieceJointe: string) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            // Vous pouvez stocker le fichier sélectionné dans le modèle
            // this[pieceJointe].fichier = fileList[0];
        }
    }


    onSelectFile(event: any): void {
        console.log(event.target.files[0]);
        this.file = event.target.files[0];
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
               // this.getPieceByDmd(this.demande.id!);
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

    onTypeDemandeurChange(): void {
        if (this.selectedTypeDemandeur) {
            this.motifsFiltres = this.motifs.filter((motif) => motif.typeDemandeur === this.selectedTypeDemandeur?.libelle);
            this.selectedMotif = undefined;
        } else {
            this.motifsFiltres = [];
            this.selectedMotif = undefined;
        }

    }


    displayCalendar = false;

    openCalendar() {
        this.displayCalendar = true;
    }

    loadPieces() {
        this.pieceService.findAll().subscribe(response => {
            this.pieces = cloneDeep(response.body!)
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }


    loadTypeDemande() {
        this.typeDemandeService.findAll().subscribe(response => {

            this.typeDemandes = response.body!;
            console.warn("================", this.typeDemandes)
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }


    loadMotif() {
        this.motifService.findAll().subscribe(response => {
            this.motifs = response.body!;

            this.motifWithPieces = this.motifs.map((motif: IMotif) => ({
                motif: motif.libelle!,
                pieces: []
            }));
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }

    loadStructure() {
        this.structureService.findListe().subscribe(response => {
            this.structures = response.body!;
        }, error => {
            this.message = {severity: 'error', summary: error.error};
            console.error(JSON.stringify(error));
        });
    }

    onChangeMatricule() {
        this.numeroMatricule = this.demande.agent!.matricule!;
        console.warn("Matr================================================", this.numeroMatricule)

        if (this.numeroMatricule) {
            this.isFetchingAgentInfo = true; // Activez l'indicateur de chargement
            console.warn("agent================================================", this.agent)
            console.warn("agent================================================", this.agentInfo)
            // Faites une requête au service pour obtenir les informations de l'agent en utilisant this.numeroMatricule
            this.agentService.getAgentInfoByMatricule(this.numeroMatricule)
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

    saveEntity(): void {
        this.clearDialogMessages();
        this.isDialogOpInProgress = true;
        if (this.demande) {
            if (this.demande.id) {
                this.demandeService.update(this.demande).subscribe(
                    {
                        next: (response) => {
                            this.dialogRef.close(response);
                            this.dialogRef.destroy();
                            this.showMessage({severity: 'success', summary: 'demande modifié avec succès'});

                        },
                        error: (error) => {
                            console.error("error" + JSON.stringify(error));
                            this.isOpInProgress = false;
                            this.showMessage({severity: 'error', summary: error.error.message});

                        }
                    });
            } else {
                this.demandeService.create(this.demande).subscribe({
                    next: (response) => {
                        this.dialogRef.close(response);
                        this.dialogRef.destroy();
                        this.showMessage({
                            severity: 'success',
                            summary: 'demande creer avec succès',
                        });
                    },
                    error: (error) => {
                        console.error("error" + JSON.stringify(error));
                        this.isOpInProgress = false;
                        this.showMessage({severity: 'error', summary: error.error.message});

                    }
                });
            }
        }
    }

    initObjet(){
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
    }

}
