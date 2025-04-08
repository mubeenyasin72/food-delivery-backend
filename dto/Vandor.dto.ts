export interface CreateVandorInput{
    name: string;
    ownerName: string;
    foodType: [string];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
} 

export interface EditVandorInput{
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}
export interface VandorLoginInput{
    email: string;
    password: string;
}
export interface VandorPayload{
    _id: string;
    name: string;
    email: string;
    foodTypes: [string];
}