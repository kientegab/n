import {LigneItems} from "./LigneItems";

export interface IInvoice {
    items?: LigneItems[],
    total_amount?: number,
    devise?: string,
    description?: string,
    customer?: string,
    customer_firstname?: string,
    customer_lastname?: string,
    customer_email?: string,
    external_id?: string,
    otp?:string

}
export class Invoice implements IInvoice {

    constructor(
        public items?: LigneItems[],
        public total_amount?: number,
        public devise?: string,
        public description?: string,
        public customer?: string,
        public customer_firstname?: string,
        public customer_lastname?: string,
        public customer_email?: string,
        public external_id?: string,
        public otp?:string
    ) { }


}
