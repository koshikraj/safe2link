export type TWalletDetails = {
    id: string;
    address: `0x${string}` | string;
    subOrgId: string;
    balance: string;
};

export type THttpError = {
    message: string;
}
