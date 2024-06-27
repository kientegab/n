import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {IPiece} from "../model/piece.model";
import { pieceJointe } from '../model/pieceJointe.model';

@Injectable({
    providedIn: 'root'
})
export class UploadFileService {

    constructor(private http: HttpClient) {
    }

    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${environment.detachementUrl}/files/upload-piece`, formData, {
            reportProgress: true,
            responseType: 'json'
        });

        return this.http.request(req);
    }
    create(file: File): Observable<HttpResponse<pieceJointe>> {
        const formData: FormData = new FormData();

        formData.append('file', file);
        return this.http.post<pieceJointe>(`${environment.detachementUrl}/files/upload-piece`, formData, { observe: 'response' });
    }

}
