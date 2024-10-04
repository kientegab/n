import {Duree} from "./duree.model";
import {ITypeDemandeur} from "./typeDemandeur.model";
import {Commande} from "./commande";

export interface IPaiement {
    commande?: Commande,
}

export class Paiement implements IPaiement {
    constructor(
        public commande?: Commande,
    ) { }


}
