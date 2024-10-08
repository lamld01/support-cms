import { SellerAccountStatus } from "@/model/enum";

export interface SellerProfileFilter {
    accountId?: string;
    profileId?: string;
    email?: string;
    phoneNumber?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    gender?: SellerAccountStatus;
    birth?: string;
    page: number | 1;
    size: number | 20;
    sort: string[] | [];
}

export interface SellerProfile {
    id: number;
    email: string;
    phoneNumber: string;
    displayName: string;
    firstName: string;
    lastName: string;
    gender: string;
    birth: string;
    accountId: number;
}

