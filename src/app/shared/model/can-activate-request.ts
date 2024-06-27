import { IAgent } from "./agent.model";
import { IMinistere } from "./ministere.model";
import { IProfil } from "./profil-old";
import { IStructure } from "./structure.model";
import { IUser } from "./user";

export interface ICanActivateRequest {
    nom?: string;
	prenom?: string;
    telephone?:String;
    username?:String;
	matricule?: string;
    email?: string;
    password?: string;
    
 
	dateNaissance?: Date;
	dateRecrutement?: Date;
    ministere?: IMinistere;
    structure?: IStructure;
    typeAgent?: string;
    profil?: IProfil;
    // ministeres?: IMinistere[];
    // structures?: IStructure[];
    superieurHierarchique?: ICanActivateRequest
}
export class CanActivateRequest implements ICanActivateRequest{
    constructor(
    public nom?: string,
    public prenom?: string,
    public telephone?:String,
    public matricule?: string,
    public ministere?: IMinistere,
    public structure?: IStructure,
    public profil?: IProfil,
    public email?: string,
    public password?: string,
    // public ministeres?: IMinistere[],
    // public structures?: IStructure[],
    public superieurHierarchique?: ICanActivateRequest
    ){}

}
export interface ICreateAccountRequest {
    email?: string;
   // noMatricule?: string;
    matricule?:String;
    password?: string;
    
  }

export class CreateAccountRequest implements ICreateAccountRequest{
constructor(
    public email?: string,
    public matricule?:String,
   // public noMatricule?: string,
    public password?: string
){}
}