import { IDemande } from "./demande.model";

export interface IArticleDemande{
    id?: number;
    code?: string;
    libelle?: string;
    demande?:IDemande
}

export class ArticleDemande implements IArticleDemande{
    constructor(
        public id?: number, 
        public code?: string,
        public libelle?: string,
        public demande?:IDemande
    ){}
}