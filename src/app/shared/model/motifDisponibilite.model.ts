import {Duree} from "./duree.model";

export interface IMotif {
    id?: number,
    libelle?: string;
    plafondAnnee?: number;
    dureeMax?:Duree;
    //typeDemandeur?:String;
    //typeDemandeurDto?: ITypeDemandeur

}

export class Motif implements IMotif {
    constructor(
        public id?: number,
        public libelle?: string,
        public plafondAnnee?: number,
        public dureeMax?: Duree,
    //    public typeDemandeur?: String,
     //   public typeDemandeurDto?: ITypeDemandeur
    ) { }


}

