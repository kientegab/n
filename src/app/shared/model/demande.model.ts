import { IAgent } from "./agent.model";
import { IHistorique } from "./historique.model";
import { IPieceJointe } from "./pieceJointe.model";
import { IStructure } from "./structure.model";
import { ITypeDemande } from "./typeDemande.model";

export interface IDemande {
    id?: number;
    dateEffet?: Date;
    typeDemandeur?: TypeDemandeur;
    typeDemande?: ITypeDemande;
    numero?: string;
    dateDemande?: Date;
    structDestination?: IStructure;
    status?: String;
    pieceJointe?: IPieceJointe[];
    agent?: IAgent;
    historiques?: IHistorique[];
}

export class Demande implements IDemande {
    constructor(
        public id?: number,
        public dateEffet?: Date,
        public typeDemandeur?: TypeDemandeur,
        public typeDemande?: ITypeDemande,
        public numero?: string,
        public dateDemande?: Date,
        public structDestination?: IStructure,
        public status?: String,
        public pieceJointe?: IPieceJointe[],
        public agent?: IAgent,
        public historiques?: IHistorique[],

    ){
    }

}

export enum TypeDemandeur {
    Agent = 'agent',
    Structure = 'structure',
  }
// export interface GetAllTypeDemandeResponse {
//     typeDemandes: ITypeDemande[];
// }
