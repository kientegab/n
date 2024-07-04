
export interface IMinistere{
    id?: number;
    code?: string;
    libelle?: string;
    sigle?: string;
    civilite?:string;
    titre?:string
}
export class Ministere implements IMinistere {
    constructor(
        public id?: number,
        public code?: string,
        public libelle?: string,
        public civilite?: string,
        public titre?: string,
        public sigle?: string,){}
}
export const CIVILITE = [
    { code: 'Monsieur', lib: 'Monsieur' },
    { code: 'Madame', lib: 'Madame' },
    { code: 'Mademoiselle', lib: 'Mademoiselle' },
];
  


