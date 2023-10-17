import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TokenService } from 'src/app/shared/service/token.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js'; 

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

@Component({
  selector: 'app-public-menu',
  templateUrl: './public-menu.component.html',
  styleUrls: [
    './public-menu.component.scss'
]
})
export class PublicMenuComponent implements  OnInit {
    loggedIn = false;
    authorize_uri = environment.authorize_uri;
    logout_url = environment.logout_url;
  
    isLogged: boolean | undefined;
    isAdmin: boolean | undefined;
  
    params: any = {
      client_id: environment.client_id,
      redirect_uri: environment.redirect_uri,
      scope: environment.scope,
      response_type: environment.response_type,
      response_mode: environment.response_mode,
      code_challenge_method: environment.code_challenge_method
    }
  

  
    constructor(private router: Router,
      private tokenService: TokenService,) { }

    // ngOnDestroy(): void {
    //     throw new Error('Method not implemented.');
    // }
    
    items: MenuItem[]=[];
  
    onLogin(): void {
      const code_verifier = this.generateCodeVerifier();
      console.warn('Code verifier', code_verifier);
      this.tokenService.setVerifier(code_verifier);
      this.params.code_challenge = this.generateCodeChallenge(code_verifier);
      const httpParams = new HttpParams({fromObject: this.params});
      const codeUrl = this.authorize_uri + httpParams.toString();
      location.href = codeUrl;
    }
  
  
  
    onLogout(): void {
      location.href = this.logout_url;
    }
  
    getLogged(): void {
      this.isLogged = this.tokenService.isLogged();
      this.isAdmin = this.tokenService.isAdmin();
    }
  
    generateCodeVerifier(): string {
      let result = '';
      const char_length = CHARACTERS.length;
      for(let i =0; i < 44; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * char_length));
      }
      return result;
    }
  
    generateCodeChallenge(code_verifier: string): string {
      console.warn('Code verifier', code_verifier);
      const codeverifierHash = CryptoJS.SHA256(code_verifier).toString(CryptoJS.enc.Base64);
      console.warn('Code verifier', codeverifierHash);
      const code_challenge = codeverifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
      return code_challenge;
    }
   
    ngOnInit() {
      this.getLogged();
      this.items = [
        {
          label: 'Accueil',
          icon: 'pi pi-home',
          routerLink: [''] 
        },
        { 
          label: 'Détachement',
          items: [
            {
              label: 'Nouvelle détachement',
              routerLink: ['/public/N_detachement'],
              routerLinkActiveOptions: {
                exact: true
              }
            },
            {
              separator: true
            },
            {
              label: 'Renouvellement détachement',
              routerLink: ['/public/R_detachement'],
              routerLinkActiveOptions: {
                exact: true
              } 
            },
            {
              separator: true
            },
            {
              label: 'Fin détachement',
              routerLink: ['/public/F_detachement'],
              routerLinkActiveOptions: {
                exact: true
              } 
            },
            {
              separator: true
            },
            {
                label: 'Rectification détachement',
                routerLink: ['/public/RE_detachement'],
                routerLinkActiveOptions: {
                  exact: true
                } 
              },
              {
                separator: true
              },
            {
              label: 'Annulation détachement',
              routerLink: ['/public/A_detachement'],
              routerLinkActiveOptions: {
                exact: true
              } 
            },
            
          ]
        },
        {
          label: 'Disponibilité',
          items: [
            {
              label: 'Nouvelle disponibilité',
              routerLink: ['/public/N_disponibilite'],
              routerLinkActiveOptions: {
                exact: true
              }
            },
            {
              separator: true
            },
            {
              label: 'Renouvellement disponibilité',
              routerLink: ['/public/R_disponibilite'],
              routerLinkActiveOptions: {
                exact: true
              } 
            },
            {
              separator: true
            },
            {
              label: 'Fin disponibilité',
              routerLink: ['/public/F_disponibilite'],
              routerLinkActiveOptions: {
                exact: true
              } 
            },
            {
              separator: true
            },
            {
                label: 'Rectification disponibilité',
                routerLink: ['/public/RE_disponibilite'],
                routerLinkActiveOptions: {
                  exact: true
                } 
              },
              {
                separator: true
              },
            {
              label: 'Annulation disponibilité',
              routerLink: ['/public/A_disponibilite'],
              routerLinkActiveOptions: {
                exact: true
              } 
            },
            
          ]
        },
        
        {
          label: 'Manuel Utilisateur',
          command: () => this.download(),
        },
        {
            label: 'Nous contacter',
            routerLink: ['public/contact'] 
          },
      ];
    }
  
  
    logout(): void {
      // this.tokenStorageService.signOut();
       this.router.navigate(['/']);
       window.location.reload();
     }

     login() {
       this.router.navigate(['auth/login']);
     }
   
     download(){
        window.open(environment.domaine+'/assets/img/manuel.pdf','_blank');
      }


}
