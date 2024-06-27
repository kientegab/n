import { Injectable } from '@angular/core';
import { IVisaDemande } from '../model/visaDemande.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { LazyLoadEvent } from 'primeng/api';

type EntityResponseType = HttpResponse<IVisaDemande>;
type EntityArrayResponseType = HttpResponse<IVisaDemande[]>;


const visaUrl = environment.detachementUrl+'/visa-demandes';

@Injectable({
  providedIn: 'root'
})
export class VisaProjetService {
  constructor(private http:HttpClient) { }

  create(visa: IVisaDemande): Observable<EntityResponseType> {
    return this.http.post<IVisaDemande>(visaUrl+'/new', visa, { observe: 'response' });
  }

  update(groupe: IVisaDemande): Observable<EntityResponseType> {
    return this.http.put<IVisaDemande>(visaUrl+'/update', groupe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVisaDemande>(`${visaUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVisaDemande[]>(visaUrl+'/list-page', { params: options, observe: 'response' });
  }

   findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IVisaDemande[]>(visaUrl+'/list', { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${visaUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IVisaDemande[]>(visaUrl+'/list', { observe: 'response' });
  }

  findVisaByDemande(idDemande:number): Observable<EntityResponseType> {
    return this.http.get<IVisaDemande>(`${visaUrl}/list/${idDemande}`, { observe: 'response' });
  }

}
