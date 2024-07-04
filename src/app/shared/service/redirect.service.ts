import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Paiement} from "../model/paiement";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private http:HttpClient) { }

    redirectPaiement(url: string, data: any, headers: { [key: string]: string }) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        }

        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = headers[key];
                form.appendChild(input);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    postWithHeaders(url: string, body: any, headers: HttpHeaders): Observable<any> {
        return this.http.post(url, body, { headers });
    }

}
