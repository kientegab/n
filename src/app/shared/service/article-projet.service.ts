import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IArticleDemande } from '../model/articleDemande.model';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { createRequestOption } from '../util/request-util';

type EntityResponseType = HttpResponse<IArticleDemande>;
type EntityArrayResponseType = HttpResponse<IArticleDemande[]>;

const articleUrl = environment.detachementUrl+'/article-demandes';

@Injectable({
  providedIn: 'root'
})
export class ArticleProjetService {


  constructor(private http:HttpClient) { }
  create(article: IArticleDemande): Observable<EntityResponseType> {
    return this.http.post<IArticleDemande>(articleUrl+'/new', article, { observe: 'response' });
  }

  update(article: IArticleDemande): Observable<EntityResponseType> {
    return this.http.put<IArticleDemande>(articleUrl+'/update', article, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArticleDemande>(`${articleUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
   // return this.http.get<IArticleDemande[]>("assets/data/articles.json", { params: options, observe: 'response' });
     return this.http.get<IArticleDemande[]>(articleUrl+'/list-page', { params: options, observe: 'response' });
  }

  findAll(event?: LazyLoadEvent): Observable<EntityArrayResponseType> {
    return this.http.get<IArticleDemande[]>(articleUrl+'/list', { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${articleUrl}/${id}`, { observe: 'response' });
  }

  findListe(): Observable<EntityArrayResponseType> {
    return this.http.get<IArticleDemande[]>(articleUrl+'/list', { observe: 'response' });
  }

  findArticleByDemande(idDemande:number): Observable<EntityResponseType> {
    return this.http.get<IArticleDemande>(`${articleUrl}/list/${idDemande}`, { observe: 'response' });
  }
}
