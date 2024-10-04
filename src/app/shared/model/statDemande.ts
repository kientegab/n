export interface IStatDemande {
    total?: number;
    libelle?: string;
    structure?: string;
}

export class StatDemande implements IStatDemande {
    constructor(
        public total?: number,
        public libelle?: string,
        public structure?: string,
        
    ){}
}