import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/service/auth.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-activation-compte',
  templateUrl: './activation-compte.component.html',
  styleUrls: ['./activation-compte.component.scss']
})
export class ActivationCompteComponent {
  token?: any;
  activationStatus?: string;
  isLoggedIn = false;

  constructor(private route: ActivatedRoute, private activationService: AuthenticationService,    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.activateAccount();
      
    });
  }

  
  activateAccount(): void {
    console.log('Token to be sent:', this.token);
    this.activationService.activateAccount(this.token)
      .subscribe(
        response => {
          console.log('Activation response:', response);
          this.activationStatus = response.message;
          if (response.message === 'Activation réussie') {
            this.redirectToLogin();
          }
        },
        error => {
          console.error('Activation error:', error);
          this.activationStatus = error.error.message || 'Échec de l\'activation.';
        }
      );
  }

  redirectToLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000); // délai de 2 secondes avant la redirection
  }

}
