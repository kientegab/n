import {Ministere} from "./ministere.model";
import {IStructure, Structure} from "./structure.model";

export interface IStructureMinistere {
    id?: number;
    statut?: boolean;
    dateDebut?: Date;
    dateFin?: Date;
    structure?: Structure;
    ministere?: Ministere
}

export class StructureMinistere implements IStructureMinistere {
    constructor(
        public id?: number,
        public dateDebut?: Date,
        public dateFin?: Date,
        public structure?: Structure,
        public ministere?: Ministere
    ) {
    }
}