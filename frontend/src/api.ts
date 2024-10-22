import axios from "axios";
import { settings } from "./settings";
import { UserDetails } from "./types/user";
import { TopupDetails, TopupToken } from "./types/topup";
import { TransactionDetails, TransactionToken } from "./types/transaction";

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

export async function cancelTransactionToken(): Promise<boolean> {
    try {
        const resp = await fetcher.post("/student/cancelTransaction");
        if (resp.data.message === "No transaction to cancel") {
            return false; // don't update user
        } else {
            return true; // update user
        }
    } catch (error) {
        return false;
    }
}

export async function getTransactionDetails(transId: string): Promise<TransactionDetails | null> {
    try {
        const resp = await fetcher.get("/booth/getTransaction", {
            params: {
                transaction_id: transId,
            },
        })
        return resp.data as TransactionDetails;
    } catch (error) {
        return null;
    }
}

export async function collectTransaction(transId: string): Promise<boolean> {
    try {
        await fetcher.post("/booth/collectTransaction", {
            transaction_id: transId,
        });
        return true;
    } catch (error) {
        return false;
    }
}

export async function login(username: string, password: string): Promise<boolean> {
    try {
        await fetcher.post("/user/login/password", {
            username,
            password,
        });
        return true;
    } catch (error) {
        return false;
    }
}

export async function logout(): Promise<boolean> {
    try {
        await fetcher.get("/user/logout");
        return true;
    } catch (error) {
        return false;
    }
}

export async function getTopup(tokenId: string): Promise<TopupDetails | null> {
    try {
    const resp = await fetcher.get("/admin/getTopup", {
        params: {
            token_id: tokenId,
        },
    });
    return resp.data as TopupDetails;
} catch (error) {
    return null;
}
}

export async function addMoney(tokenId: string, amount: string): Promise<boolean> {
    try {
        await fetcher.post("/admin/addMoney", {
            token_id: tokenId,
            amount,
        });
        return true;
    } catch (error) {
        return false;
    }
}