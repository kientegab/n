import {Duree} from "./duree.model";

export interface IMotifDisponibilite {
    id?: number,
    libelle?: string;
    plafondAnnee?: number;
    dureeMax?:Duree;
    //typeDemandeur?:String;
    //typeDemandeurDto?: ITypeDemandeur

}

export class MotifDisponibilite implements IMotifDisponibilite {
    constructor(
        public id?: number,
        public libelle?: string,
        public plafondAnnee?: number,
        public dureeMax?: Duree,
    //    public typeDemandeur?: String,
     //   public typeDemandeurDto?: ITypeDemandeur  
    ) { }


}

