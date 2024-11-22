import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { MenuItem, MessageService, Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LISTE_TYPE_AGENT } from 'src/app/shared/constants/liste.constants';
import { Agent, IAgent } from 'src/app/shared/model/agent.model';
import { CanActivateRequest, CreateAccountRequest, ICanActivateRequest, ICreateAccountRequest } from 'src/app/shared/model/can-activate-request';
import { IMinistere } from 'src/app/shared/model/ministere.model';
import { IProfil, Profil } from 'src/app/shared/model/profil-old';
import { IStructure } from 'src/app/shared/model/structure.model';
import { AgentService } from 'src/app/shared/service/agent.service';
import { MinistereService } from 'src/app/shared/service/ministere-service';
import { ProfilService } from 'src/app/shared/service/profil.service';
import { StructureService } from 'src/app/shared/service/structure.service';
import { UserService } from 'src/app/shared/service/user.service';
enum Step {
  CANACTIVATE, CREATION
}
@Component({
  selector: 'app-creer-modifier-agent',
  templateUrl: './creer-modifier-agent.component.html',
  styleUrls: ['./creer-modifier-agent.component.scss']
})
export class CreerModifierAgentComponent {


  @ViewChild('cf') form!: NgForm;

  activeStep = Step.CANACTIVATE;
  maxDocumentDate = new Date();
  yearRange = `1900:${this.maxDocumentDate.getFullYear()}`;

  isOpInProgress!: boolean;
  isLoadingDossierTypes!: boolean;
  candidateHasDossier!: boolean;

  request: ICanActivateRequest = new CanActivateRequest();

  agent: IAgent = new Agent ();
  idAgt: number | undefined;
  isDisplay = true;
  accountRequest: ICreateAccountRequest = new CreateAccountRequest();
  pwdConfirmation: any;

  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  agentInfo: any;
  stepItems!: MenuItem[];
  ministeres: IMinistere[]= [];
  structures: IStructure[]= [];
  profils: IProfil [] = [];
  isFetchingAgentInfo: boolean = false; // Pour gérer l'état de chargement
  dossierTypes!: any[];
  selectedType: any;
  filteredStructures: any;


  profil: IProfil = new Profil()

  typeAgents= LISTE_TYPE_AGENT;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog: DynamicDialogConfig,
    private accountService: UserService,
    private ministereService: MinistereService,
    private profilService: ProfilService,
    private structureService: StructureService,
    private agentService: AgentService,
    private messageService: MessageService,
    private router: Router

  ) { }

  ngOnInit() {
    this.loadMinistere();
    this.loadStructure();
    this.loadProfil();
   // this.LoadAgentByMatricule();

   // this.idAgt= +this.activatedRoute.snapshot.paramMap.get('id')!;

    // if(this.idAgt){
    //     this.getAgent();
    // }
    if (this.dynamicDialog.data) {
        this.request = cloneDeep(this.dynamicDialog.data);
        console.warn("MMM",this.request);
      }

    if (!this.request.superieurHierarchique) {
      this.request.superieurHierarchique = {
        matricule: '' // Valeur par défaut ou vide
      };
    }

    if (!this.agent.superieurHierarchique) {
      this.agent.superieurHierarchique = {
        matricule: '' // Valeur par défaut ou vide
      };
    }

    this.stepItems = [
      { label: 'Verification' },
      { label: 'Creation du Compte' }
    ];
  }

  loadMinistere(): void {
    this.ministereService.findListe().subscribe(result => {
        if (result && result.body) {
            this.ministeres = result.body || [];
        }
    });
}

loadProfil(): void {
  this.profilService.findAll().subscribe(result => {
      if (result && result.body) {
        console.log("Profil::===============================",result.body)
          this.profils = result.body || [];



      }
  });


  if (!this.request.superieurHierarchique) {
    this.request.superieurHierarchique = {matricule: ''};
}

}

// loadStructure(): void {
//   this.structureService.findAll().subscribe(result => {
//       if (result && result.body) {
//         console.log("Structures::::::::::::::=",result.body)
//           this.structures =  result.body;
//       }
//   });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
fetchAgentDetails() {
  if (!this.request.matricule) {
    this.showMessage({ severity: 'warn', summary: 'Attention', detail: 'Veuillez renseigner un matricule.' });
    return;
  }

  this.agentService.getAgentByMatricule(this.request.matricule).subscribe( response =>{
   
      // Mettre à jour les champs du formulaire avec les données récupérées
      this.request.nom = response.body!.nom;
      this.request.prenom = response.body!.prenom;
      this.request.telephone = response.body!.telephone;
      this.request.profil = response.body!.profil;
   //   this.request.superieurHierarchique.matricule = data.superieurHierarchique.matricule;
      this.request.ministere = response.body!.ministere;
      this.request.structure = response.body!.structure;
      this.request.emploi = response.body!.emploi;
      this.request.fonction = response.body!.fonction;
      this.request.email = response.body!.email;

      this.showMessage({ severity: 'success', summary: 'Succès, Agent récupérés.', detail: 'Détails de l\'agent récupérés.' });
    },
    error => {
      this.showMessage({ severity: 'error', summary: 'Erreur, Agent introuvable.', detail: 'Agent introuvable.' });
    });
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
isEditing() {
  return !!this.agent.id;
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

loadAgentByMatricule(matricule :string) {
    this.agentService.getAgentByMatricule(matricule).subscribe(response => {

        this.request = response.body!;
        this.request.nom=response.body!.nom;
        this.request.matricule=response.body!.matricule;
        this.request.superieurHierarchique?.matricule!=response.body!.superieurHierarchique?.matricule;
        console.log("agent================", this.request)
        console.log("matricule================", this.request.matricule)
    }, error => {
        this.message = {severity: 'error', summary: error.error};
        console.error(JSON.stringify(error));
    });
  }

/* desactiver apres
  canActivate() {
    this.isOpInProgress = true;
    this.accountService.canActivate(this.request).subscribe(response => {
      if (response.canActivate) {
        this.activeStep = Step.CREATION;
        this.showMessage({ severity: 'success', summary: 'Vous pouvez maintenant créer votre compte' });
        this.candidateHasDossier = response.hasDossier;
      } else {
        this.showMessage({ severity: 'error', summary: 'Vous n\'êtes pas encore éligible pour les départs à la rétraite de cette année. Au besoin, veillez contacter le DRH de votre ministère.' });
      }
      this.isOpInProgress = false;
    }, (error: HttpErrorResponse) => {
      this.isOpInProgress = false;
      this.handleError(error);
    });
  }

*/


//   getAgent(): void {
//     this.agentService.find(this.idAgt!).subscribe(result => {
//         if (result && result.body) {
//             this.agent = result.body;
//             this.isDisplay = false;
//             console.warn("Agent",this.agent);
//             this.LoadAgentByMatricule();
//         }
//     });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
LoadAgentByMatriculeSuperieur(matricule: string) {
  if (this.request.superieurHierarchique && this.request.superieurHierarchique.matricule) {
    this.isFetchingAgentInfo = true; // Activez l'indicateur de chargement
   // console.warn("agent================================================", this.agent)
    console.log("matricule================================================", matricule)
    // Faites une requête au service pour obtenir les informations de l'agent en utilisant this.matricule
    this.agentService.getAgentInfoByMatricule(this.request.superieurHierarchique.matricule)
        .subscribe(
            (response) => {

               // console.warn("agent================================================", this.agent)
               // console.warn("agent================================================", this.agentInfo)

                // Vérifiez que la réponse est réussie
                if (response && response.body) {
                    this.agent = response.body;
                    this.isFetchingAgentInfo = false; // Désactivez l'indicateur de chargement une fois les données obtenues
                    //console.log("agent================================================", this.agent)
                    //console.warn("agent================================================", this.agentInfo)
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
create() {
  this.clearDialogMessages();
  this.isDialogOpInProgress = true;

  // Vérifie si une requête (données utilisateur) est fournie
  if (this.request) {
    console.log("Utilisateur à traiter :", this.request);

    // Si l'ID existe, il s'agit d'une modification
    if (this.request.id) {
      this.agentService.updateAgent(this.request).subscribe({
        next: (response) => {
          this.dialogRef.close(response); // Ferme la boîte de dialogue avec succès
          this.showMessage({
            severity: 'success',
            summary: 'Utilisateur modifié avec succès'
          });
        },
        error: (error) => {
          console.error("Erreur lors de la modification :", error);
          this.isDialogOpInProgress = false; // Réinitialise l'état
          this.handleError(error); // Appelle une fonction centralisée pour gérer les erreurs
        }
      });
    } else {
      // Si pas d'ID, il s'agit d'une création
      this.accountService.create(this.request).subscribe({
        next: (response) => {
          this.showMessage({
            severity: 'success',
            summary: 'Compte utilisateur créé avec succès'
          });

          // Attends 2 secondes pour afficher le message avant de rediriger
          setTimeout(() => {
            this.resetForm(); // Réinitialise le formulaire
            this.router.navigate(['admin/agents']); // Redirige vers la liste des agents
          }, 2000);

          this.isDialogOpInProgress = false; // Fin de l'opération
        },
        error: (error) => {
          console.error("Erreur lors de la création du compte :", error);
          this.isDialogOpInProgress = false; // Fin de l'opération en cas d'erreur
          this.handleError(error); // Gère les erreurs
        }
      });
    }
  } else {
    this.isDialogOpInProgress = false;
    this.showMessage({
      severity: 'error',
      summary: 'Données utilisateur manquantes.'
    });
  }
}

/**
 * Gère les erreurs rencontrées lors des opérations.
 * @param error - L'objet erreur reçu
 */
handleError(error: any) {
  let errorMessage = 'Une erreur est survenue.';

  if (error.status === 409) { // Conflit : utilisateur déjà existant
    errorMessage = "Cet utilisateur existe déjà. Contactez l'administrateur.";
  } else if (error.status === 400) { // Requête invalide
    errorMessage = "Données invalides. Veuillez vérifier votre saisie.";
  } else if (error.error && error.error.message) {
    // Si un message spécifique est disponible
    errorMessage = error.error.message;
  }

  this.showMessage({
    severity: 'error',
    summary: errorMessage
  });
}


    loadStructuresByMinistere(ministereId: number): void {
      if (!ministereId) {
        this.filteredStructures = [];
        return;
      }
      
  
      this.structureService.findStructureByMinistere(ministereId).subscribe(response =>{
        this.filteredStructures = response.body!;
        console.log("structures::::::::::::::::::::::::",this.filteredStructures);
      },
        error => {
          console.error('Erreur lors du chargement des structures :', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les structures.',
          })
        });
    }
  

  resetForm() {
    this.request = {}; // Réinitialisez le modèle du formulaire (request) à un objet vide.
    this.pwdConfirmation = null;
    this.form.reset(); // Réinitialisez le formulaire lui-même si vous avez accès à l'objet FormGroup.
  }



  clearDialogMessages() {
    this.dialogErrorMessage = null;
}
// Errors

/*handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
}*/

showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
        this.message = null;
    }, 5000);
}

}
