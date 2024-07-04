import {Commande} from "./commande";
import {LigneItems} from "./LigneItems";

export interface IItems {
    items?: LigneItems[],
}

export class Items implements IItems {
    constructor(
        public items?: LigneItems[],
    ) { }


}
