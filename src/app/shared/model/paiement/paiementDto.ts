export interface Welcome {
    commande: Commande;
}

export interface Commande {
    invoice:     Invoice;
    store:       Store;
    actions:     Actions;
    custom_data: CustomData;
}

export interface Actions {
    cancel_url:   string;
    return_url:   string;
    callback_url: string;
}

export interface CustomData {
    order_id:       string;
    transaction_id: string;
}

export interface Invoice {
    items:              Item[];
    total_amount:       number;
    devise:             string;
    description:        string;
    customer:           string;
    customer_firstname: string;
    customer_lastname:  string;
    customer_email:     string;
    external_id:        string;
    otp:                string;
}

export interface Item {
    name:        string;
    description: string;
    quantity:    number;
    unit_price:  number;
    total_price: number;
}

export interface Store {
    name:        string;
    website_url: string;
}
