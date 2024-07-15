
export interface ITransaction {
    id?:           number;
    date?:           string;
    response_code?:  string;
    token?:          string;
    description?:    string;
    amount?:         string;
    montant?:        string;
    response_text?:  null;
    status?:         string;
    custom_data?:    CustomDatum[];
    operator_name?:  string;
    operator_id?:    string;
    customer?:       string;
    transaction_id?: string;
    external_id?:    string;
}

export class Transaction implements ITransaction {
    constructor(
    public id?:  number,
    public date?:  string,
    public response_code?:  string,
    public token?:          string,
    public description?:    string,
    public amount?:         string,
    public montant?:        string,
    public response_text?:  null,
    public status?:         string,
    public custom_data?:    CustomDatum[],
    public operator_name?:  string,
    public operator_id?:    string,
    public customer?:       string,
    public transaction_id?: string,
    public external_id?:    string,
    ) { }
}

export interface CustomDatum {
    id_invoice:         number;
    keyof_customdata:   string;
    valueof_customdata: string;
}
