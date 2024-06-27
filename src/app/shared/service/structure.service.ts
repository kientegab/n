import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createRequestOption } from '../util/request-util';
import {GetAllStructureResponse, IStructure} from "../model/structure.model";


type EntityResponseType = HttpResponse<IStructure>;
type EntityArrayResponseType = HttpResponse<IStructure[]>;
const baseUri = environment.detachementUrl;


const structureUrl = environment.detachementUrl+'/ministere-structures/list-page';
// const structurePostUrl = environment.detachementUrl+'/structures';
const structurePostUrl = environment.detachementUrl+'/structures';


@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(private http:HttpClient) { }

  create(structure: IStructure): Observable<EntityResponseType> {
    return this.http.post<IStructure>(structurePostUrl, structure, { observe: 'response' });
  }

  update(structure: IStructure): Observable<EntityResponseType> {
    return this.http.put<IStructure>(`${baseUri}/structures`, structure, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStructure>(`${structureUrl}/${id}`, { observe: 'response' });
  }

  findStructureByMinistere(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IStructure[]>(`${structureUrl}/ministere-structures/${id}`, { observe: 'response' });
  }


  findMinistereByStructure(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IStructure[]>(`${structureUrl}/ministere/${id}`, { observe: 'response' });
  }


  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStructure[]>(structureUrl, { params: options, observe: 'response' });
  }

   findAll(): Observable<HttpResponse<IStructure[]>> {
    return this.http.get<IStructure[]>(structureUrl, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${baseUri}/structures/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IStructure[]>(`${baseUri}/structures/list`, { observe: 'response' });
  }

  getAll(event?: LazyLoadEvent): Observable<any> {
    return this.http.get(structureUrl, { observe: 'response' })
    .pipe(map(response => {
        let structureResponse: GetAllStructureResponse = {
          structures: response.body as IStructure[]
        };
        return structureResponse;
      }));
  }

  
}
