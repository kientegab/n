import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Agent, IAgent } from 'src/app/shared/model/agent.model';
import { ChangePasswordDTO, IChangePasswordDTO } from 'src/app/shared/model/change-password-dto';
import { IUser, User } from 'src/app/shared/model/user';
import { AgentService } from 'src/app/shared/service/agent.service';
import { AuthenticationService } from 'src/app/shared/service/auth.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-infos-user',
  templateUrl: './infos-user.component.html',
  styleUrls: ['./infos-user.component.scss']
})
export class InfosUserComponent {




  user: IAgent = new Agent();
  oldPassword: string | undefined;
  newPassword: string | undefined;
  confirmPassword: string | undefined;


  changePasswordDTO: IChangePasswordDTO = new ChangePasswordDTO();

  today = new Date();

  isChangeInfoPerso = false;
  agent: IAgent = new Agent ();
  strongPassword = false;
  isFetchingAgentInfo: boolean = false; // Pour gérer l'état de chargement

  newMail: string | undefined;

  isTypePassword = true; // true :'password', false: text;

  @ViewChild('passwordForm') public validePasswordForm!: NgForm;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private tokenService: TokenService,
    private agentService: AgentService,
    private router: Router
  ) {}

  // getUser(): any {
  //   const user = window.sessionStorage.getItem(USER_KEY);
  //   if(user) {
  //     console.log("======= get user saved json========= : ", JSON.parse(user));
  //     console.log("======= get user saved ========= : ", user);
  //     return JSON.parse(user);
  //   }
  //   return {};
  // }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();

    console.log("user connecté::::::::::",this.user)
this.LoadAgentByMatriculeSuperieur(this.user.matricule!)

  }
LoadAgentByMatriculeSuperieur(matricule: string) {

    this.isFetchingAgentInfo = true; // Activez l'indicateur de chargement
   // console.warn("agent================================================", this.agent)
    console.log("matricule================================================", matricule)
    // Faites une requête au service pour obtenir les informations de l'agent en utilisant this.matricule
    this.agentService.getAgentInfoByMatricule(matricule)
        .subscribe(
            (response) => {
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

}
//   getUser(): void {

//   this.tokenService.getUser().subscribe((account: { body: IUser; }) => {
//     if (account) {
//       this.user = account.body!;
//     }
//     console.log("user::::::::::::::::::::::",this.user)
//   });
// }

  changePassword(): void {
    // if (this.newPassword !== this.confirmPassword) {
          //this.changePasswordDTO.oldPassword;
          //this.changePasswordDTO.newPassword = this.newPassword;
          this.changePasswordDTO.matricule = this.user.matricule;
          console.log(this.changePasswordDTO);
          this.userService.changePassword(this.changePasswordDTO).subscribe(
            (response) => {
                console.log(response);
               // this.authService.logout();
               //this.router.navigate(['admin/agents']);
               this.router.navigate(['/admin']);

                });


                  this.emptyFields();
  }

  emptyFields(): void {
    this.newMail = undefined;
    this.oldPassword = undefined;
    this.newPassword = undefined;
    this.confirmPassword = undefined;
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  checkIdentiquePassword(): void {
    if (
      this.newPassword != this.confirmPassword &&
      !this.validePasswordForm.controls['confirmPassword']?.errors?.['pattern'] &&
      !this.validePasswordForm.controls['confirmPassword']?.errors?.['required']
    ) {
      this.validePasswordForm.controls['confirmPassword'].setErrors({ nomatch: true });
    }
  }

  togglePassword(): void {
    this.isTypePassword = !this.isTypePassword;
  }
}
