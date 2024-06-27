import { Injectable } from '@angular/core';
import { IAgent } from '../model/agent.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../util/request-util';
import { LazyLoadEvent } from 'primeng/api';


type EntityResponseType = HttpResponse<IAgent>;
type EntityArrayResponseType = HttpResponse<IAgent[]>;


//const agentUrl = environment.authentificationUrl;

const agentUrl = environment.detachementUrl+'/agents';
// const agentUrl = "assets/data/agents.json";



@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private http:HttpClient) { }
  create(agent: IAgent): Observable<EntityResponseType> {
    return this.http.post<IAgent>(agentUrl+'/new', agent, { observe: 'response' });
  }

  update(agent: IAgent): Observable<EntityResponseType> {
    return this.http.put<IAgent>(agentUrl+'/update', agent, { observe: 'response' });
  }

  find(matricule: number): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${agentUrl}/${matricule}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
   // return this.http.get<Iagent[]>("assets/data/agents.json", { params: options, observe: 'response' });
     return this.http.get<IAgent[]>(agentUrl+'/list-page', { params: options, observe: 'response' });
  }

  findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IAgent[]>(agentUrl+'/list', { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${agentUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IAgent[]>(agentUrl+'/list', { observe: 'response' });
  }

  getAgentInfoByMatricule(matricule: string): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${agentUrl}/matricule/${matricule}`, { observe: 'response' });
  }

}
