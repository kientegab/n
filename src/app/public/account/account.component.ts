import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LISTE_TYPE_AGENT } from 'src/app/shared/constants/liste.constants';
import { Agent, IAgent } from 'src/app/shared/model/agent.model';
import { CanActivateRequest, CreateAccountRequest, ICanActivateRequest, ICreateAccountRequest } from 'src/app/shared/model/can-activate-request';
import { IMinistere } from 'src/app/shared/model/ministere.model';
import { IProfil, Profil } from 'src/app/shared/model/profil.model';
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
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @ViewChild('cf') form!: NgForm;

  activeStep = Step.CANACTIVATE;
  maxDocumentDate = new Date();
  yearRange = `1900:${this.maxDocumentDate.getFullYear()}`;

  isOpInProgress!: boolean;
  isLoadingDossierTypes!: boolean;
  candidateHasDossier!: boolean;

  request: ICanActivateRequest = new CanActivateRequest();

  agent: IAgent = new Agent ();

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


  profil: IProfil = new Profil()

  typeAgents= LISTE_TYPE_AGENT;

  constructor(
    private accountService: UserService,
    private dialogRef: DynamicDialogRef,
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
    this.LoadAgentByMatricule();

    if (!this.request.superieurHierarchique) {
      this.request.superieurHierarchique = {
        matricule: '' // Valeur par défaut ou vide
      };
    }

    this.stepItems = [
      { label: 'Verification' },
      { label: 'Creation du Compte' }
    ];
  }

  loadMinistere(): void {
    this.ministereService.findAll().subscribe(result => {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
LoadAgentByMatricule() {
  if (this.request.superieurHierarchique && this.request.superieurHierarchique.matricule) {
    this.isFetchingAgentInfo = true; // Activez l'indicateur de chargement
    console.warn("agent================================================", this.agent)
    console.warn("agent================================================", this.agentInfo)
    // Faites une requête au service pour obtenir les informations de l'agent en utilisant this.matricule
    this.agentService.getAgentInfoByMatricule(this.request.superieurHierarchique.matricule)
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////














create() {
    // this.accountRequest.noMatricule = this.request.noMatricule;
    // this.profil = { name: "SH" };

   // this.request.profil = this.profil
    //this.request.profil = this.profil
     this.request.profil= { id: 2 };




   // this.LoadAgentByMatriculeSuperieur(this.request.superieurHierarchique!.matricule!)
//debut
if (this.request.superieurHierarchique && this.request.superieurHierarchique.matricule) {
    this.isFetchingAgentInfo = true; // Activez l'indicateur de chargement
   // console.warn("agent================================================", this.agent)
    //console.log("matricule================================================", matricule)
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
                    this.request.superieurHierarchique = this.agent;


                    this.isOpInProgress = true;
                    // console.log("Profils=====================================================",this.profil)
                    //console.log("Création de compte=====================================================",this.request);
                    console.log(" objet Supérieur ", this.agent)
                    console.log("bon",this.request);

                    this.accountService.create(this.request).subscribe(


                      {
                        next: (response) => {
                          this.dialogRef.close(response);
                          this.dialogRef.destroy();
                          this.router.navigate(['admin/agents']);
                          this.showMessage({
                              severity: 'success',
                              summary: 'agent créé avec succès',

                          });

                              this.resetForm();
                      this.router.navigate(['/login']);
                       setTimeout(() => {
                         this.accountService.login();
                       }, 2000);
                       this.accountRequest = {};
                       this.pwdConfirmation = null;
                       this.form.reset();
                       this.isOpInProgress = false;
                  //   },

                          this.isDialogOpInProgress = false;
                      },
                      error: (error) => {
                         console.error("error" + JSON.stringify(error));
                         this.isOpInProgress = false;
                         this.isDialogOpInProgress = false;
                         this.showMessage({severity: 'error', summary: error.error.message});

                     }



                  }

                    )

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
    console.log("agent================================================", this.agent)
    console.log("agent================================================", this.agentInfo)
    // Réinitialisez les informations de l'agent si le numéro matricule est vide
    this.agent = new Agent();
}
//fin





}


//   create() {
//     // this.accountRequest.noMatricule = this.request.noMatricule;
//     // this.profil = { name: "SH" };

//    // this.request.profil = this.profil
//     //this.request.profil = this.profil
//      this.request.profil= { id: 2 };


//     this.request.superieurHierarchique = this.agent;

//     //creation de l objet siperieur hierarchique

//     this.agentService.getAgentByMatricule(this.request.superieurHierarchique.matricule!).subscribe(response => {

//         this.request = response.body!;
//         this.request.superieurHierarchique = response.body!.superieurHierarchique;
//         this.request.superieurHierarchique?.matricule!=response.body!.superieurHierarchique?.matricule;
//         console.log("agent================", this.request.superieurHierarchique);
//         //console.log("matricule================", this.request.matricule)
//     }, error => {
//         this.message = {severity: 'error', summary: error.error};
//         console.error(JSON.stringify(error));
//     });

//     //fin



//     this.isOpInProgress = true;
//     // console.log("Profils=====================================================",this.profil)
//     console.log("Création de compte=====================================================",this.request);
//    // console.warn("Supérieur à envoyé================================================", this.agent)
//     console.log("agentttttttttttt: ",this.request);
//     this.accountService.create(this.request).subscribe(() => {
//       this.showMessage({ severity: 'success', summary: 'Compte d\'utilisateur crée avec succès' });
//       this.resetForm();
//       this.router.navigate(['/login']);
//       setTimeout(() => {
//         this.accountService.login();
//       }, 2000);
//       this.accountRequest = {};
//       this.pwdConfirmation = null;
//       this.form.reset();
//       this.isOpInProgress = false;
//     }, error => {
//       this.isOpInProgress = false;
//       this.handleError(error);
//     });



//   }






  resetForm() {
    this.request = {}; // Réinitialisez le modèle du formulaire (request) à un objet vide.
    this.pwdConfirmation = null;
    this.form.reset(); // Réinitialisez le formulaire lui-même si vous avez accès à l'objet FormGroup.
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
}
