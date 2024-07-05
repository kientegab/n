import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Paiement} from "../model/paiement";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

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

    redirectToExternalUrl(externalUrl: string, agentData: any): Observable<any> {
        const headers = new HttpHeaders({
            'ApiKey': 'V5T3Z0O594C6QNZ4L',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF9hcHAiOiIxODI0OSIsImlkX2Fib25uZSI6ODk5NDIsImRhdGVjcmVhdGlvbl9hcHAiOiIyMDI0LTA3LTA0IDE1OjA2OjE2In0.MPR-WGFdX3PoBAH8IbMreF6AENu2DImrcRzTuiznjXY',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http.post('http://localhost:8081/api/detachements/demandes/redirect/new', { externalUrl, agentData }, { headers });
    }

    redirectToSpringBootServer() {
        // Replace 'http://localhost:8080/redirect' with your actual Spring Boot endpoint
        this.http.get('http://localhost:8081/api/detachements/demandes/redirect', { observe: 'response', responseType: 'text' })
            .subscribe(response => {
                console.warn('Redirect response jjj:', response);
                // Redirect logic, if needed, can be handled in Angular based on response
            }, error => {
                console.warn('ERR response jjj:', error);
                if (error.status === 301) {
                    const newLocation = error.headers
                    console.warn('Received 301 redirect to:', error.headers);
                   // window.location.href = 'newLocation'; // Redirect using window.location
                }
                console.error('Redirect error:', error);
                // Handle errors
            });
    }


    redirectToSpringBootServer2() {
        // Replace 'http://localhost:8080/redirect' with your actual Spring Boot endpoint
        return this.http.get('http://localhost:8081/api/detachements/demandes/redirect', { observe: 'response' })
            .pipe(

                catchError((error) => {
                    console.warn("error",error)
                    if (error.status === 301) {
                        const newLocation = error.headers.get('Location');
                        console.log('Received 301 redirect to:', newLocation);
                        window.location.href = newLocation; // Redirect using window.location
                    }else{
                        console.warn("error",error)
                    }
                    return throwError(error); // Re-throw the error to be handled by the subscriber
                })
            );

    }


}
