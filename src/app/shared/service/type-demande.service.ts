import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createRequestOption } from '../util/request-util';
import {GetAllTypeDemandeResponse, ITypeDemande} from "../model/typeDemande.model";

type EntityResponseType = HttpResponse<ITypeDemande>;
type EntityArrayResponseType = HttpResponse<ITypeDemande[]>;


const typeDemandeUrl = environment.detachementUrl+"/type-demandes";
const typeDemandeDisponibiliteUrl = environment.disponibiliteUrl+"/type-demandes";
// const agentUrl = "assets/data/agents.json";

// const typeDemandeUrl = environment.detachementUrl+"/type-demandes";

@Injectable({
  providedIn: 'root'
})
export class TypeDemandeService {

  constructor(private http:HttpClient) { }

  create(typeDemande: ITypeDemande): Observable<EntityResponseType> {
    return this.http.post<ITypeDemande>(`${typeDemandeUrl}/new`, typeDemande, { observe: 'response' });
  }

  update(typeDemande: ITypeDemande): Observable<EntityResponseType> {
    return this.http.put<ITypeDemande>(`${typeDemandeUrl}/update`, typeDemande, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeDemande>(`${typeDemandeUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeDemande[]>(`${typeDemandeUrl}/list-page`, { params: options, observe: 'response' });
  }


  ///////////////////service disponibilité///////////////////////

  createDis(typeDemande: ITypeDemande): Observable<EntityResponseType> {
    return this.http.post<ITypeDemande>(`${typeDemandeDisponibiliteUrl}/new`, typeDemande, { observe: 'response' });
  }

  updateDis(typeDemande: ITypeDemande): Observable<EntityResponseType> {
    return this.http.put<ITypeDemande>(`${typeDemandeDisponibiliteUrl}/update`, typeDemande, { observe: 'response' });
  }

  findDis(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeDemande>(`${typeDemandeDisponibiliteUrl}/${id}`, { observe: 'response' });
  }

  queryDis(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeDemande[]>(`${typeDemandeDisponibiliteUrl}/list-page`, { params: options, observe: 'response' });
  }


   findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<ITypeDemande[]>(`${typeDemandeUrl}/list-page`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${typeDemandeUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<ITypeDemande[]>(`${typeDemandeUrl}/list`, { observe: 'response' });
  }

    findListeDisponibilite(): Observable<EntityArrayResponseType> {
        return this.http.get<ITypeDemande[]>(`${typeDemandeDisponibiliteUrl}/list`, { observe: 'response' });
    }

  getAll(event?: LazyLoadEvent): Observable<any> {
    return this.http.get(typeDemandeUrl, { observe: 'response' })
    .pipe(map(response => {
        let structureResponse: GetAllTypeDemandeResponse = {
          typeDemandes: response.body as ITypeDemande[]
        };
        return structureResponse;
      }));
  }
}
