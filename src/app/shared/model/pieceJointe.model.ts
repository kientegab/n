import { IDemande } from "./demande.model";

export class IPieceJointe {
    id?: number;
    libelle?:string;
    url?:string;
    nomFichier?: string;
    extensionFichier?: string;
    tailleFichier?: number
    demande?: IDemande

}

export class pieceJointe implements IPieceJointe {
    constructor(
       public id?: number,
       public libelle?:string,
       public url?:string,
       public nomFichier?: string,
       public extensionFichier?: string,
       public tailleFichier?: number,
       public demande?: IDemande

    ) { }
}
