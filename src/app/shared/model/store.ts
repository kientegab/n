import {LigneItems} from "./LigneItems";

export interface IStore {
    name?: string,
    website_url?: string

}
export class Store implements IStore {
    constructor(
        public name?: string,
        public website_url?: string

    ) { }


}
