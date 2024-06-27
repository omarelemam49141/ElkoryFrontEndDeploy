export interface IAdmin {
    fName: string;
    lName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    street: string;
    postalCode: string;
    password?: string;
    isDeleted: boolean;
    role: number;
}
