export interface ILigneItems {
    name?: string, // DÉSIGNATION DE L'ÉLÉMENT
    description?: string, // DESCRIPTION DE L'ÉLÉMENT “quantity”: 3, // QUANTITÉ DE L'ÉLÉMENT
    unit_price?: number, // PRIX UNITAIRE DE L'ÉLÉMENT
    total_price?: number, // PRIX TOTAL POUR L'ÉLÉMENT


}
export class LigneItems implements ILigneItems {
    constructor(
        public name?: string, // DÉSIGNATION DE L'ÉLÉMENT
        public description?: string, // DESCRIPTION DE L'ÉLÉMENT “quantity”: 3, // QUANTITÉ DE L'ÉLÉMENT
        public unit_price?: number, // PRIX UNITAIRE DE L'ÉLÉMENT
        public total_price?: number, // PRIX TOTAL POUR L'ÉLÉMENT
    ) { }


}
