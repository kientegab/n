import {Invoice} from "./invoice";
import {Store} from "./store";
import {Actions} from "./actions";
import {CustomData} from "./custom_data";

export interface ICommande {
    invoice?: Invoice,
    store?: Store,
    actions?: Actions,
    custom_data?: CustomData,
}

export class Commande implements ICommande {
    constructor(
        public invoice?: Invoice,
        public store?: Store,
        public actions?: Actions,
        public custom_data?: CustomData,
    ) { }


}
