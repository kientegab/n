import { HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICorps } from '../model/corps.model';
import { createRequestOption } from '../util/request-util';

type EntityResponseType = HttpResponse<ICorps>;
type EntityArrayResponseType = HttpResponse<ICorps[]>;

const corpsUrl = environment.corpsUrl;

@Injectable({
  providedIn: 'root'
})
export class CorpsService {

  constructor(private http:HttpClient) { }
  create(corps: ICorps): Observable<EntityResponseType> {
    return this.http.post<ICorps>(corpsUrl, corps, { observe: 'response' });
  }

  update(corps: ICorps): Observable<EntityResponseType> {
    return this.http.put<ICorps>(corpsUrl, corps, { observe: 'response' });
  }

  findCorpsByIdProvince(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<ICorps[]>(`${corpsUrl}/liste/${id}`, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICorps>(`${corpsUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
   // return this.http.get<ICorps[]>("assets/data/corpss.json", { params: options, observe: 'response' });
     return this.http.get<ICorps[]>(corpsUrl, { params: options, observe: 'response' });
  }

  findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<ICorps[]>(corpsUrl+'/liste', { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${corpsUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<ICorps[]>(corpsUrl, { observe: 'response' });
  }
}
