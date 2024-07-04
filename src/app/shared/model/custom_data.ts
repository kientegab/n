import {LigneItems} from "./LigneItems";

export interface ICustomData {
    order_id?: string,
    transaction_id?: string,

}
export class CustomData implements ICustomData {
    constructor(
        public order_id?: string,
        public transaction_id?: string,
    ) { }


}
