export interface IProfil{
    id?: number;
    name?: string;
    actif?: boolean;
    // motif?: IMotif;
}

export class Profil implements IProfil{
    constructor(
        public id?: number,
        public name?: string,
        public actif?: boolean,
        // public motif?: IMotif
    ){}
}