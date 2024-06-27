import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ILoginVM, LoginVM } from 'src/app/shared/model/login-vm';
import { User } from 'src/app/shared/model/user';
import { AuthenticationService } from 'src/app/shared/service/auth.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	rememberMe: boolean = false;
	@ViewChild('dtf') form!: NgForm; 

	account: ILoginVM = new LoginVM();

	isOpInProgress!: boolean;
	isDialogOpInProgress!: boolean;
	message: any;
	dialogErrorMessage: any;
	timeoutHandle: any;
	isLoggedIn = false;
	isLoginFailed = false;
	saveSuccess: boolean = false;
	errorMessage = '';

	constructor(
		private layoutService: LayoutService,
		private tokenService: TokenService,
		private authService: AuthenticationService,
		private router: Router
		) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

	// seConnecter(): void {
	// 	this.clearDialogMessages();
	// 	this.isDialogOpInProgress = true;
	// 	// this.router.navigate(['/admin']);
	// 	this.authService
	// 	  .login(this.account)
	// 	  .subscribe(
	// 		{
	// 			next: (response) => {
	// 			  this.showMessage({ severity: 'success', summary: 'Vous êtez authentifié avec succès' });
	// 			},
	// 			error: (error) => {
	// 			 console.error("error" + JSON.stringify(error));
	// 			  this.isOpInProgress = false;
	// 			  this.showMessage({ severity: 'error', summary: error.message });
	
	// 			}
	// 		  });

	//   }

	seConnecter(): void {
		this.authService
		  .login(this.account)
		  .subscribe( 
			(data) => {
				if(data.body){
				//    console.warn("DATA::::::::::::::::::::::::::",data.body!);
				   let user = data.body!;
				   this.tokenService.saveToken(user.access_token);
				   this.tokenService.saveUser(user);
				   this.isLoginFailed = false;
				   this.isLoggedIn = true;
				   // this.setRoute(user.profil);
				   this.router.navigate(['/admin']);
				   this.saveSuccess = true;
				   // this.message = 'Échec de la connexion, nom d\'utilisateur ou mot de passe incorrect';

				   console.log("USER::::::::::::::",user)
			    }
		   },
		   err => {
			   this.errorMessage= 'Matricule ou mot de passe incorrect!!'
			   // this.errorMessage = err.error.message;
			   this.isLoginFailed = true;
			}
		);
	}


	setRoute(profil: string) {
	switch (profil) {
		case 'ROLE_ADMIN':
		this.router.navigate(['/admin']);
		break;
		case 'ROLE_AG':
		this.router.navigate(['agent']);
		break;
		case 'ROLE_DRH':
		this.router.navigate(['drh']);
		break;
		default:
		this.router.navigate(['superieur']);
		break;
	}
	}
	  
  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
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


}
