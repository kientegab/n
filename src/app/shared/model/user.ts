import { IPrivilege } from "./privilege";
import { IProfil } from "./profil-old";

export interface IUser {
    id?: number;
    nomUtilisateur?: string;
   /* usermane?: string;
    dateNaissance?: Date;
    photo?: string;*/
    email?: string; 
    nom?: string;
    prenom?: string;
    actif?: boolean;
    activationKey?: string;
    resetKey?: string;
    confirmationExpireDate?: Date;
    resetExpireDate?: Date;
   // langKey?: string;
    telephone?: string;
    profile?: IProfil;
  //  privilegeCollection?: IPrivilege[];
    password?: string;
    confirmePassword?: string;
}

export class User implements IUser {
    constructor(
        public id?:number,
        public nomUtilisateur?: string,
        public email?: string,
        // public usermane?: string,
        // public photo?: string,
        // public dateNaissance?: Date,
        public nom?: string,
        public prenom?: string,
        public actif?: boolean,
        public activationKey?: string,
        public resetKey?: string,
        public confirmationExpireDate?: Date,
        public resetExpireDate?: Date,
        public telephone?: string,
        public profile?: IProfil,
       // public privilegeCollection?: IPrivilege[],
        public password?: string,
        public confirmePassword?: string,
    ){}
}