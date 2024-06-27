import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAmpliationDemande } from '../model/ampliationDemande.model';
import { Observable } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { LazyLoadEvent } from 'primeng/api';

type EntityResponseType = HttpResponse<IAmpliationDemande>;
type EntityArrayResponseType = HttpResponse<IAmpliationDemande[]>;


const ampliationUrl = environment.detachementUrl+'/ampliation-demandes';
@Injectable({
  providedIn: 'root'
})


export class AmpliationProjetService {


  constructor(private http:HttpClient) { }

  create(ampliation: IAmpliationDemande): Observable<EntityResponseType> {
    return this.http.post<IAmpliationDemande>(ampliationUrl +'/new', ampliation, { observe: 'response' });
  }

  update(groupe: IAmpliationDemande): Observable<EntityResponseType> {
    return this.http.put<IAmpliationDemande>(ampliationUrl +'/update', groupe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAmpliationDemande>(`${ampliationUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAmpliationDemande[]>(ampliationUrl+'/list-page', { params: options, observe: 'response' });
  }

   findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IAmpliationDemande[]>(ampliationUrl+'/list', { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${ampliationUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IAmpliationDemande[]>(ampliationUrl+'/list', { observe: 'response' });
  }

  findAmpliationByDemande(idDemande:number): Observable<EntityResponseType> {
    return this.http.get<IAmpliationDemande>(`${ampliationUrl}/list/${idDemande}`, { observe: 'response' });
  }

}
