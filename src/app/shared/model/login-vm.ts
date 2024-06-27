export interface ILoginVM {
    matricule?:string;
    password?:string;
    rememberMe?:boolean;
}

export class LoginVM implements ILoginVM {

    constructor(
        public matricule?:string, 
        public password?:string,
        public rememberMe?:boolean,
        ) {}
}