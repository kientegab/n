import {LigneItems} from "./LigneItems";

export interface IActions {
    cancel_url?: string,
    return_url?: string,
    callback_url?: string,

}
export class Actions implements IActions {
    constructor(
        public cancel_url?: string,
        public return_url?: string,
        public callback_url?: string

    ) { }


}
