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

  strongPassword = false;

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
          this.changePasswordDTO.oldPassword;
          this.changePasswordDTO.newPassword = this.newPassword;
          console.log(this.changePasswordDTO);
          this.userService.changePassword(this.changePasswordDTO).subscribe(
            () => { 
                this.authService.logout();
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
