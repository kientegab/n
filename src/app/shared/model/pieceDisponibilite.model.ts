
import { IMotifDisponibilite } from "./motifDisponibilite.model";


export interface IPieceDisponibilite{
    id?: number;
    libelle?: string;
    motif?: IMotifDisponibilite;
}

export class PieceDisponibilite implements IPieceDisponibilite{
    constructor(
        public id?: number,
        public libelle?: string,
        public motif?: IMotifDisponibilite
    ){}
}