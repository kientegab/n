import { IMinistere } from "./ministere.model";
import { IProfil } from "./profil.model";
import { IStructure } from "./structure.model";

export interface IAgent {
    id?: number;
    nom?: string;
    prenom?: string;
    matricule?: string;
    telephone?: string;
    email?: string;
    sexe?: string;
    dateNaiss?: Date;
    lieuNaiss?: string;
    dateRecrut?: string;
    noCNIB?: string;
    qualite?: string;
    dateQualite?: string;
    echelle?: string;
    echelon?: string;
    classe?: string;
    categorie?: string;
    structure?: IStructure;
    fonction?: string;
    position?: string;
    superieurHierarchique?: IAgent;
    profil?: IProfil;
    ministere?: IMinistere;

    // actif?: boolean;
}
export class Agent implements IAgent {
    constructor(
        public id?: number,
        public nom?: string,
        public prenom?: string,
        public matricule?: string,
        public telephone?: string,
        public email?: string,
        public sexe?: string,
        public dateNaiss?: Date,
        public lieuNaiss?: string,
        public dateRecrut?: string,
        public noCNIB?: string,
        public qualite?: string,
        public dateQualite?: string,
        public echelle?: string,
        public echelon?: string,
        public classe?: string,
        public categorie?: string,
        public structure?: IStructure,
        public fonction?: string,
        public position?: string,
        public superieurHierarchique?: IAgent,
        public profil?: IProfil,
        public ministere?: IMinistere

        // public actif?: boolean
    ) { }

}


