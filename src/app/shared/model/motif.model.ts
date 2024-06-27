import { IPiece } from "./piece.model";
import {Duree} from "./duree.model";
import {ITypeDemandeur} from "./typeDemandeur.model";

export interface IMotif {
    id?: number,
    libelle?: string;
    plafondAnnee?: number;
    dureeMax?:Duree;
    typeDemandeur?:String;
    typeDemandeurDto?: ITypeDemandeur

}

export class Motif implements IMotif {
    constructor(
        public id?: number,
        public libelle?: string,
        public plafondAnnee?: number,
        public dureeMax?: Duree,
        public typeDemandeur?: String,
        public typeDemandeurDto?: ITypeDemandeur
    ) { }


}

export enum TypeDemandeur {
    AGENT = 'AGENT',
    STRUCTURE = 'STRUCTURE',
  }
