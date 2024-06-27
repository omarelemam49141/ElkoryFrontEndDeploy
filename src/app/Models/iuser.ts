export interface IUser {
  userId?: number;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  governorate: string;
  city: string;
  street: string;
  postalCode: string;
  isDeleted:boolean;
  role:number;
}
