export interface IChangePasswordDTO {
    matricule?: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export class ChangePasswordDTO implements IChangePasswordDTO{
    constructor(
        public matricule?: string,
        public password?: string,
        public newPassword?: string,
        public confirmPassword?: string,
        ) {}
}
