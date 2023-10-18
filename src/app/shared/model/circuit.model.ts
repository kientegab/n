
export class ICircuit{
    id?: number;
    position ?: string;
    statut ?: boolean;
    delai ?: string;
    parent ?: ICircuit;
   

}

export class Circuit implements ICircuit{
    constructor(
        public id?: number, 
        public position ?: string,
        public statut ?: boolean,
        public delai ?: string,
        public parent ?: ICircuit,
       
        ){}
}
export interface GetAllCircuitResponse {
    circuits: ICircuit[];
}