import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ILoginVM } from '../model/login-vm';
import { IUser, User } from '../model/user';
import { Router } from '@angular/router';

const authRessourceUrl = environment.authResource;
const accountRessourceUrl = environment.accountResource;

const tokne_url = environment.token_url;

type EntityResponseType = HttpResponse<IUser>;

const TOKEN_KEY = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userIdentity: User | null = null;
  private authenticationState = new ReplaySubject<User | null>(1);
  private accountCache$?: Observable<User | null>;
  private previousUrlKey = 'previousUrl';

  public static privileges: string[] = [];



  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // login(request: ILoginVM): Observable<any> {
  //   return this.http.post(authRessourceUrl, request,{ observe: 'response' });
  // }

  login(request: ILoginVM): Observable<any> {
    return this.http.post(authRessourceUrl,request,{ observe: 'response' });
  }

  storeUrl(url: string): void {
    window.sessionStorage.setItem(this.previousUrlKey, url);
  }

  getUrl(): string | null | undefined {
    return window.sessionStorage.getItem(this.previousUrlKey);
  }

  clearUrl(): void {
    window.sessionStorage.removeItem(this.previousUrlKey);
  }

  // login(credentials: ILoginVM): Observable<ILoginVM | null> {
  //   return this.loginNext(credentials).pipe(mergeMap(() => this.identity(true)));
  // }

  loginNext(credentials: ILoginVM): Observable<void> {
    return this.http
      .post(authRessourceUrl, credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe!)));
  }

  private authenticateSuccess(response: any, rememberMe: boolean): void {
    const jwt = response.accessToken;
    this.getUserInfo(jwt);
    if (rememberMe) {
      this.saveToken(jwt);
    } else {
      this.saveToken(jwt);
    }

  }

     getUserInfo(token: string) {
        let payload;
        if (token) {
            payload = token.split(".")[1];
            payload = window.atob(payload);
            console.warn("user",payload);
            return JSON.parse(payload);
        } else {
            return null;
        }
    }










  authenticate(identity: User | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }











  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.profile?.privilegeCollection) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    for (let i = 0; i < this.userIdentity.profile?.privilegeCollection.length; i++) {
      AuthenticationService.privileges.push(this.userIdentity.profile?.privilegeCollection[i]!.code!);
    }
    return AuthenticationService.privileges.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<User | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => {
          return of(null);
        }),
        tap((account: User | null) => {
          this.authenticate(account);
          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          // if (account && account.langKey) {
          //   const langKey = account.langKey;
          //   this.languageService.changeLanguage(langKey);
          // }
          if (account) {
            this.navigateToStoredUrl();
           // this.router.navigate(['admin']);
            // if (account.privileges?.length == 0) {
            //   account.privileges.push("CONSULTATION");
            // }
            // if (account.stillConnected! != true) {
            //   this.router.navigate(['administration/utilisateur/utilisateur/infos-compte']);
            // } else if (account.stillConnected == true) {
            //   this.router.navigate(['administration']);
            // }
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<User | null> {
    return this.authenticationState.asObservable();
  }

  getIdentify(): string {
    return this.userIdentity ? this.userIdentity.prenom!.concat(' ').concat(this.userIdentity.prenom!) : 'Non fourni';
  }

  private fetch(): Observable<User> {
    return this.http.get<User>(accountRessourceUrl);
  }

  private navigateToStoredUrl(): void {
    const previousUrl = this.getUrl();
    if (previousUrl) {
      this.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }else {
      this.router.navigate(['admin']);
    }
  }

  logout(): void {
    this.logoutNext().subscribe(null, null, () => this.authenticate(null));
  }

  logoutNext(): Observable<void> {
    return new Observable(observer => {
      window.sessionStorage.clear();
      window.localStorage.clear();
      AuthenticationService.privileges = [];
      localStorage.removeItem(TOKEN_KEY);
      observer.complete();
    });
  }

  findInfosUser(): Observable<EntityResponseType> {
    return this.http.get<IUser>(accountRessourceUrl, { observe: 'response' });
  }

  tokenIsExpired(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    if (token != null) {
      const tokenExpired = jwtHelper.isTokenExpired(token);
      return tokenExpired;
    }
    return true;
  }

  public saveToken(token: any): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  }

  public getToken(): string | null {
    let token = JSON.parse(localStorage.getItem(TOKEN_KEY)!);
    // if (token != null) {
    //   token = token.jwtToken;
    // }
    return token;
  }

  public getInfoUser(): any | null {
    let token = JSON.parse(localStorage.getItem(TOKEN_KEY)!);
    return token;
  }

  public getPrivilege(): Array<any> | null {
    let privilege = JSON.parse(localStorage.getItem(TOKEN_KEY)!);
    if (privilege != null) {
      privilege = privilege.additionalInfo.privileges;
    }
    return privilege;
  }

  public getUsername(): String | null {
    let user = JSON.parse(localStorage.getItem(TOKEN_KEY)!);
    if (user != null) {
      user = user.additionalInfo.username;
    }
    return user;
  }

  public tokenDecode(): any {
    const jwtHelper = new JwtHelperService();
    return jwtHelper.decodeToken(this.getToken()!);
  }

  signOut(): void {
    window.sessionStorage.clear();
    window.localStorage.clear();
    localStorage.removeItem(TOKEN_KEY);
  }

  public checkPermission(permissions: string[], perm: string[]): boolean {
    let result = false;
    for (let i = 0; i < permissions.length; i++) {
      for (let index = 0; index < perm.length; index++)
        if (permissions[i] == perm[index]) {
          return true;
        }
    }
    return result;
  }


  public static checkPermissionTest(permissions: string[], perm: string[]): boolean {
    let resultat = false;
    for (let i = 0; i < permissions.length; i++) {
      for (let index = 0; index < perm.length; index++)
        if (permissions[i] == perm[index]) {
          return true;
        }
    }
    return resultat;
  }

  public static getPrivilegeTest(): Array<any> | null {
    let privilege = JSON.parse(localStorage.getItem(TOKEN_KEY)!)
    if (privilege != null) {
      privilege = privilege.additionalInfo.privileges;
    }
    return privilege;
  }


  findToken(code: string, code_verifier: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('grant_type', environment.grant_type);
    body.set('client_id', environment.client_id);
    body.set('redirect_uri', environment.redirect_uri);
    body.set('scope', environment.scope);
    body.set('code_verifier', code_verifier);
    body.set('code', code);
    body.set('username', "admin");
    body.set('password', "admin");
    const basic_auth = 'Basic '+ btoa('client:secret');
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    const httpOptions = { headers: headers_object};
    return this.http.post<any>(tokne_url, body, httpOptions);
  }
}

