import { SellerAccountStatus, SellerRoleEnum } from "@/model/enum";

export interface SellerAccountFilter {
    username?: string;
    status?: SellerAccountStatus;
    page: number | 1;
    size: number | 20;
    sort: string[] | [];
}

export interface SellerAccount {
    id: number;
    managerAccountId: string;
    username: string;
    role: SellerRoleEnum;
    status: SellerAccountStatus;
    sellerProfileResponse : {
        id?: number;
        email?: string;
        phoneNumber?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        gender?: string;
        birth?: string;
    }
}

