import { IPrivilege } from "./privilege";

export interface IProfil {
    id?: number;
    code?: string;
    name?: string;
    profil_roles?: string;
   nativeProfile?: boolean;
   privilegeCollection?: IPrivilege[];
}

export class Profil implements IProfil {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public   profil_roles?: string,
        public nativeProfile?: boolean,
        public privilegeCollection?: IPrivilege[]
    ){}
}


export interface IProfilDTO {
    id?: number;
    name?: string;
    nativeProfile?: boolean;
   privileges?: IPrivilege[];
   profil_roles?: string,
   
}

export class ProfilDTO implements IProfilDTO {
    constructor(
        public id?: number,
        public name?: string,
      public nativeProfile?: boolean,
      public   profil_roles?: string,
        public privileges?: IPrivilege[]
    ){}
}