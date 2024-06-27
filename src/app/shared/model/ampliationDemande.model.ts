import { IDemande } from "./demande.model";

export interface IAmpliationDemande {
    id?: number;
    code?: number;
    libelle?: string;
    demande?:IDemande
}

export class AmpliationDemande implements IAmpliationDemande {
    constructor(
        public id?: number,
        public code?: number,
        public libelle?: string,
        public demande?:IDemande
    ){

    }
}
