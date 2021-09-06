import { Roles } from "./user.enum";

export interface UserAuthentification {
    tokenType: string;
    expiresIn: string;
    token: string;
    role: Roles;
    id: string;
}
