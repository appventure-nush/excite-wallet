import { randomUUID } from "node:crypto"

export function getRandom(): string {
    return randomUUID()
}
