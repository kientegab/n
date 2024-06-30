import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StatDemande } from '../model/statDemande';


const dashbordUrl = environment.dashbordUrl;

@Injectable({
    providedIn: 'root'
})

export class DashbordService {

    constructor(private http: HttpClient) { }

    getNbDemande() {
        
        return this.http.get<any>(`${dashbordUrl}/check-total-globale/`, { observe: 'response' });
        }

        getNbDemande2() {
        
            return this.http.get<any>(`${dashbordUrl}/check-total-globale/`, { observe: 'response' });
            }
    

    getCards() {
        /*return this.http.get<any>(`${dashbordUrl}/total-global/`)
            .toPromise()
            .then(res => res.data)*/
        return this.http.get<any>(`${dashbordUrl}/total-global/`, { observe: 'response' });
    }

    getNbTypeAssure() {
        
            return this.http.get<any>(`${dashbordUrl}/nombre-assure/`, { observe: 'response' });
    }

    /*getNbSecteur(){
        return this.http.get<any>(`${dashbordUrl}/nombre-assure/`)
            .toPromise()
            .then(res => res.data)
            return (
                [
                    {
                        typeSecteur : "Secteur public",
                        nombre : 300
                    },
                    {
                        typeSecteur : "Secteur privé",
                        nombre : 500
                    },
                    {
                        typeSecteur : "AISF",
                        nombre : 100
                    },
                    {
                        typeSecteur : "AISI",
                        nombre : 50
                    },
                ]
             )
    }*/

    getNbAffilieSect(id=5) {
        
        return this.http.get<any>(`${dashbordUrl}/nombre-affilie/${id}`, { observe: 'response' });
        
            /*return( [
                {
                    typeAffilie : "Secteur public",
                    annee : [
                        2019,
                        2020,
                        2021,
                        2022,
                        2023
                    ],
                    valeur : [
                        300,
                        800,
                        1500,
                        3500,
                        7000
                    ]
                },
                {
                    typeAffilie : "Secteur privé",
                    annee : [
                        2019,
                        2020,
                        2021,
                        2022,
                        2023
                    ],
                    valeur : [
                        100,
                        500,
                        1000,
                        3000,
                        6000
                    ]
                },
              ]
            )*/
    }
}