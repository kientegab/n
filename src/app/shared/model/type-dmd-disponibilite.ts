export interface ITypeDmdDisponibilite {
    libelle?: string;
    code?: string;
}

export class TypeDmdDisponibilite implements ITypeDmdDisponibilite{
    constructor(
        public libelle?: string,
        public code?: string,
    ) {}
}
