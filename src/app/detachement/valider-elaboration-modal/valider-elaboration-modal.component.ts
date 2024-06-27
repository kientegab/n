import {Component, Input} from '@angular/core';
import {Demande, IDemande} from "../../shared/model/demande.model";
import {AVIS, Historique, IHistorique, RECEPTIONS} from "../../shared/model/historique.model";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {cloneDeep} from "lodash";
import {HttpErrorResponse} from "@angular/common/http";
import {DemandeService} from "../../shared/service/demande-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-valider-elaboration-modal',
  templateUrl: './valider-elaboration-modal.component.html',
  styleUrls: ['./valider-elaboration-modal.component.scss']
})
export class ValiderElaborationModalComponent {
    demande: IDemande = new Demande();
    @Input() data: IDemande = new Demande();
    demandes: any;
    isDialogOpInProgress: boolean | undefined;
    isOpInProgress: boolean | undefined;
    dialogErrorMessage: any;
    typeDemandeService: any;
    typeDemandes: any;
    message: { severity: string; summary: any; } | undefined;
    avis = AVIS;
    receptions = RECEPTIONS;
    historique:IHistorique = new Historique();



    constructor(
        private dialogRef: DynamicDialogRef,
        private dynamicDialog:  DynamicDialogConfig,
        private demandeService: DemandeService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.dynamicDialog.data) {
            this.demande = cloneDeep(this.dynamicDialog.data);
        }
    }

    clear(): void {
        this.dialogRef.close();
        this.dialogRef.destroy();
    }


    // Errors
    handleError(error: HttpErrorResponse) {
        console.error(`Processing Error: ${JSON.stringify(error)}`);
        this.isDialogOpInProgress = false;
        this.dialogErrorMessage = error.error.title;
    }

    saveValiderProjet(): void {
        this.isDialogOpInProgress = true;
        if (this.demande) {
            this.demande.historique=this.historique;
            this.demandeService.validerElaborationDRH(this.demande).subscribe(
                {
                    next: (response: any) => {
                        this.dialogRef.close(response);
                         this.dialogRef.destroy();
                    },
                    error: (error: { error: { message: any; }; }) => {
                        console.error("error" + JSON.stringify(error));
                        this.isOpInProgress = false;
                    }
                });

        }
    }


    clearDialogMessages() {
        throw new Error('Method not implemented.');
    }

    showMessage(arg0: { severity: string; summary: string; }) {
        throw new Error('Method not implemented.');
    }

    loadTypeDemande() {
        this.typeDemandeService.findAll().subscribe((response: { body: any; }) => {

            this.typeDemandes = response.body!;
        }, (error: { error: any; }) => {
            this.message = { severity: 'error', summary: error.error };
            console.error(JSON.stringify(error));
        });
    }
}
