import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { environment } from 'src/environments/environment';
import { LazyLoadEvent } from 'primeng/api';
import { IProfil } from '../model/profil.model';



type EntityResponseType = HttpResponse<IProfil>;
type EntityArrayResponseType = HttpResponse<IProfil[]>;

const resourceUrl = "assets/data/profil.json";
const profilUrl = environment.profilUrl;


@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(protected http: HttpClient) {}

  create(profil: IProfil): Observable<EntityResponseType> {
    return this.http.post<IProfil>(profilUrl+'/new', profil, { observe: 'response' });
  }

  update(profil: IProfil): Observable<EntityResponseType> {
    return this.http.put<IProfil>(profilUrl+'/update', profil, { observe: 'response' });
  }

  addPrivilege(profil: IProfil): Observable<EntityResponseType> {
    return this.http.put<IProfil>(profilUrl, profil, { observe: 'response' });
  }

  
  findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IProfil[]>(profilUrl+'/list', { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfil>(`${profilUrl}/${id}`, { observe: 'response' });
  }

  findByName(name?: string): Observable<EntityResponseType> {
    return this.http.get<IProfil>(`${profilUrl}/${name}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfil[]>(profilUrl+'/list', { params: options, observe: 'response' });
  }

  delete(name: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${profilUrl}/${name}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IProfil[]>(profilUrl+'/list', { observe: 'response' });
  }
  
}
