import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem, Message } from 'primeng/api';
import { LISTE_TYPE_AGENT } from 'src/app/shared/constants/liste.constants';
import { CanActivateRequest, CreateAccountRequest, ICanActivateRequest, ICreateAccountRequest } from 'src/app/shared/model/can-activate-request';
import { IMinistere } from 'src/app/shared/model/ministere.model';
import { IStructureMinistere } from 'src/app/shared/model/structure-ministere.model';
import { IStructure } from 'src/app/shared/model/structure.model';
import { MinistereService } from 'src/app/shared/service/ministere-service';
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
  accountRequest: ICreateAccountRequest = new CreateAccountRequest();
  pwdConfirmation: any;

  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;

  stepItems!: MenuItem[];
  ministeres: IMinistere[]= [];
  structures: IStructure[]= [];

  dossierTypes!: any[];
  selectedType: any;

  typeAgents= LISTE_TYPE_AGENT;

  constructor(
    private accountService: UserService,
    private ministereService: MinistereService,

  ) { }

  ngOnInit() {
    this.loadMinistere();
    this.loadStructure();
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

loadStructure(): void {
  this.ministereService.findAll().subscribe(result => {
      if (result && result.body) {
          this.structures =  [];
      }
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

  create() {
    this.accountRequest.noMatricule = this.request.noMatricule;
    this.isOpInProgress = true;
    this.accountService.create(this.accountRequest).subscribe(() => {
      this.showMessage({ severity: 'success', summary: 'Compte d\'utilisateur crée avec succès' });
      setTimeout(() => {
        this.accountService.login();
      }, 2000);
      this.accountRequest = {};
      this.pwdConfirmation = null;
      this.form.reset();
      this.isOpInProgress = false;
    }, error => {
      this.isOpInProgress = false;
      this.handleError(error);
    });
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
