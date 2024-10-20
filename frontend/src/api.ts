import axios from "axios";
import { settings } from "./settings";
import { UserDetails } from "./types/user";
import { TopupToken } from "./types/topup";
import { TransactionToken } from "./types/transaction";

const fetcher = axios.create({
    withCredentials: true,
    baseURL: settings.BACKEND_URL,
})

export function getMSLoginUrl() {
    return `${settings.BACKEND_URL}/ms`;
}

export async function getUser(): Promise<UserDetails | null> {
    try {
    const resp = await fetcher.get("/me");
    return resp.data as UserDetails;
    } catch (error) {
        return null;
    }
}

export async function getTopupToken(): Promise<TopupToken | null> {
    try {
        const resp = await fetcher.post("/student/createToken");
        return resp.data as TopupToken;
    } catch (error) {
        return null;
    }
}

export async function getTransactionToken(amount: string): Promise<TransactionToken | null> {
    try {
        const resp = await fetcher.post("/student/createTransaction", {
            amount,
        });
        return resp.data as TransactionToken;
    } catch (error) {
        return null;
    }
}

export async function cancelTransationToken(transId: string): Promise<boolean> {
    try {
        const resp = await fetcher.post("/student/cancelTransaction", {
            transId
        });
        return true;
    } catch (error) {
        return false;
    }
}