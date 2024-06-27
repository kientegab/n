import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { environment } from 'src/environments/environment';
import { IUser } from '../model/user';
import { LazyLoadEvent } from 'primeng/api';
import { IValidationCompte } from '../model/validationCompte';
import { IChangePasswordDTO } from '../model/change-password-dto';
import { CanActivateRequest, ICanActivateRequest } from '../model/can-activate-request';
import { ILoginVM } from '../model/login-vm';

type EntityResponseType = HttpResponse<IUser>;
type EntityArrayResponseType = HttpResponse<IUser[]>;

type PasswordResponseType = HttpResponse<IChangePasswordDTO>;

type ValidationCompteResponseType = HttpResponse<IValidationCompte>;

const resourceUrl = environment.userUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private authenticationState = new ReplaySubject<IUser | null>(1);
  
  constructor(protected http: HttpClient) {}

  // create(user: IUser): Observable<EntityResponseType> {
  //   return this.http.post<IUser>(resourceUrl, user, { observe: 'response' });
  // }

  create(user: ICanActivateRequest): Observable<any> {
    return this.http.post<ICanActivateRequest>(resourceUrl, user, { observe: 'response' });
  }

  canActivate(request: CanActivateRequest): Observable<any> {
    //let params = this.formatParams(request);
    return this.http.post(resourceUrl, request, { observe: 'response'});
  }

  validationCompte(validationCompte: IValidationCompte): Observable<ValidationCompteResponseType> {
    return this.http.post<IValidationCompte>(resourceUrl+'/confirm-user', validationCompte, { observe: 'response' });
  }

  update(user: IUser): Observable<EntityResponseType> {
    return this.http.put<IUser>(resourceUrl, user, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUser>(`${resourceUrl}/${id}`, { observe: 'response' });
  }

  confirmeCompte(key: string): Observable<any> {
    return this.http.get(resourceUrl+'/confirm?token='+key, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: any): Observable<HttpResponse<{}>> {
    return this.http.delete(`${resourceUrl}/${login}`, { observe: 'response' });
  }

  
  login(): void {
    // return this.http.post(resourceUrl, request);
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IUser[]>(resourceUrl, { observe: 'response' });
  }

  findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IUser[]>(resourceUrl, { observe: 'response' });
  }

  changePassword(request: IChangePasswordDTO): Observable<PasswordResponseType> {
    return this.http.post<IChangePasswordDTO>(resourceUrl+'/reset-connect-password', request,{ observe: 'response' });
  }

  getAuthenticationState(): Observable<IUser | null> {
    return this.authenticationState.asObservable();
  }

  findByLogin(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${resourceUrl}/${login}`);
  }
}
