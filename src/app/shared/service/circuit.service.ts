import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICircuit } from '../model/circuit.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { LazyLoadEvent } from 'primeng/api';

type EntityResponseType = HttpResponse<ICircuit>;
type EntityArrayResponseType = HttpResponse<ICircuit[]>;
// const circuitUrl = environment.communeUrl;
const circuitUrl = environment.detachementUrl + '/circuit';
@Injectable({
  providedIn: 'root'
})
export class CircuitService {

  constructor(private http:HttpClient) { }
  create(circuit: ICircuit): Observable<EntityResponseType> {
    return this.http.post<ICircuit>(circuitUrl+ '/new', circuit, { observe: 'response' });
  }

  update(circuit: ICircuit): Observable<EntityResponseType> {
    return this.http.put<ICircuit>(circuitUrl+ '/update', circuit, { observe: 'response' });
  }

  findCommuneByIdProvince(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<ICircuit[]>(`${circuitUrl}/liste/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${circuitUrl}/${id}`, { observe: 'response' });
  }
  
  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<ICircuit[]>(circuitUrl+'/list', { observe: 'response' });
  }
  
  findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<ICircuit[]>(`${circuitUrl}/list-page`, { observe: 'response' });
  }
  
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
     return this.http.get<ICircuit[]>(circuitUrl +'/liste', { params: options, observe: 'response' });
  }
}
