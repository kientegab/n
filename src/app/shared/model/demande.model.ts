import { IAgent } from "./agent.model";
import { IDuree } from "./duree.model";
import { IHistorique } from "./historique.model";
import { IMotif } from "./motif.model";
import { IPieceJointe } from "./pieceJointe.model";
import { IPiecesFourniesDTO } from "./piecesFourniesDTO.model";
import { IStructure } from "./structure.model";
import { ITypeDemande } from "./typeDemande.model";

export interface IDemande {
    id?: number;
    dateEffet?: Date;
    // typeDemandeur?: TypeDemandeur;
    typeDemande?: ITypeDemande;
    numero?: string;
    dateDemande?: Date;
    // strucDestination?: IStructure;
    statut?: String;
    pieceJointe?: IPieceJointe[];
    agent?: IAgent;
    historique?: IHistorique;
    motif?: IMotif,
    piecesFourniesDTO?: IPiecesFourniesDTO[],
    duree?: IDuree,
    structure?: IStructure[]
}

export class Demande implements IDemande {
    constructor(
        public id?: number,
        public dateEffet?: Date,
        // public typeDemandeur?: TypeDemandeur,
        public typeDemande?: ITypeDemande,
        public numero?: string,
        public dateDemande?: Date,
        // public strucDestination?: IStructure,
        public statut?: String,
        public pieceJointe?: IPieceJointe[],
        public agent?: IAgent,
        public historique?: IHistorique,
        public motif?: IMotif,
        public piecesFourniesDTO?: IPiecesFourniesDTO[],
        public duree?: IDuree,
        public structure?: IStructure[]

    ){}

}


// export interface GetAllTypeDemandeResponse {
//     typeDemandes: ITypeDemande[];
// }
