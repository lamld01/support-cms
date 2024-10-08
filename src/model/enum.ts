enum SellerAccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    NEW ='NEW',
    BANNED = 'BANNED'
}

enum SellerRoleEnum {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    READ_ONLY ='READ_ONLY',
}

enum SellerGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',

}
export {SellerAccountStatus, SellerGender, SellerRoleEnum}