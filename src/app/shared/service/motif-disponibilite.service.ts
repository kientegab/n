import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { environment } from 'src/environments/environment';
import { IMotifDisponibilite } from '../model/motifDisponibilite.model';

type EntityResponseType = HttpResponse<IMotifDisponibilite>;
type EntityArrayResponseType = HttpResponse<IMotifDisponibilite[]>;


//const motifUrl = "assets/data/motif.json";
const motifUrl = environment.disponibiliteUrl+'/motifs';

@Injectable({
  providedIn: 'root'
})


export class MotifDisponibiliteService {

  constructor(private http:HttpClient) { }

  create(motif: IMotifDisponibilite): Observable<EntityResponseType> {
    return this.http.post<IMotifDisponibilite>(motifUrl+'/new', motif, { observe: 'response' });
  }

  update(groupe: IMotifDisponibilite): Observable<EntityResponseType> {
    return this.http.put<IMotifDisponibilite>(motifUrl+'/update', groupe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMotifDisponibilite>(`${motifUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    // return this.http.get<IMotifDisponibilite[]>(motifUrl+'/list-page', { params: options, observe: 'response' });
    return this.http.get<IMotifDisponibilite[]>(motifUrl+'/list-page', { params: options, observe: 'response' });
  }

   findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IMotifDisponibilite[]>(motifUrl+'/list', { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${motifUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IMotifDisponibilite[]>(motifUrl+'/list', { observe: 'response' });
  }

}
