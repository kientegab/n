
export interface IPaiement {
    commande?: Commande;
}

export class Paiement implements IPaiement {
    constructor(
        public commande?: Commande,

    ) { }
}

export interface ICommande {
    invoice?:     Invoice;
    store?:       Store;
    actions?:     Actions;
    custom_data?: CustomData;
}

export class Commande implements ICommande {
    constructor(
        public invoice?:     Invoice,
        public store?:       Store,
        public actions?:     Actions,
        public custom_data?: CustomData,
    ) { }
}

export interface IActions {
    cancel_url?:   string;
    return_url?:   string;
    callback_url?: string;
}

export class Actions implements IActions {
    constructor(
        public cancel_url?: string,
        public return_url?: string,
        public callback_url?: string,
    ) { }
}

export interface ICustomData {
    order_id?:       string;
    transaction_id?: string;
}

export class CustomData implements ICustomData {
    constructor(
        public order_id?: string,
        public transaction_id?: string,
    ) { }
}

export interface IInvoice {
    items?:              Item[];
    total_amount?:       number;
    devise?:             string;
    description?:        string;
    customer?:           string;
    customer_firstname?: string;
    customer_lastname?:  string;
    customer_email?:     string;
    external_id?:        string;
    otp?:                string;
}

export class Invoice implements IInvoice {
    constructor(
        public items?: Item[],
        public total_amount?: number,
        public devise?: string,
        public description?: string,
        public customer?: string,
        public customer_firstname?: string,
        public customer_lastname?: string,
        public customer_email?: string,
        public transaction_id?: string,
        public external_id?: string,
        public otp?: string,
    ) { }
}

export interface IItem {
    name?:        string;
    description?: string;
    quantity?:    number;
    unit_price?:  number;
    total_price?: number;
}

export class Item implements IItem {
    constructor(
        public name?: string,
        public description?: string,
        public quantity?: number,
        public unit_price?: number,
        public total_price?: number
    ) { }
}

export interface IStore {
    name?:        string;
    website_url?: string;
}
export class Store implements IStore {
    constructor(
        public name?: string,
        public website_url?: string,
    ) { }
}
