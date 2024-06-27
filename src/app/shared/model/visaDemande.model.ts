import { IDemande } from "./demande.model";

export interface IVisaDemande {
    id?: number;
    code?: number;
    libelle?: string;
    demande?:IDemande
}

export class VisaDemande implements IVisaDemande {
    constructor(
        public id?: number,
        public code?: number,
        public libelle?: string,
        public demande?:IDemande
    ){}
}
