import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/service/auth.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.css']
})
export class AuthorizedComponent implements OnInit {

  code = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe( data => {
      this.code = data['code'];
      const code_verifier = this.tokenService.getVerifier();
      this.tokenService.deleteVerifier();
      this.getToken(this.code, code_verifier);
    });
  }

  getToken(code: string, code_verifier: string): void {
    this.authService.findToken(code, code_verifier).subscribe(
      data => {
       this.tokenService.setTokens(data.access_token, data.refresh_token);
       this.tokenService.saveUser(data);
       console.log("========tok======", data);
       this.router.navigate(['']);
      },
      err => {
        console.log(err);
      }
    );
  }

}
