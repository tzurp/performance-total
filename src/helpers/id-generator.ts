import crypto from "crypto";

export class IdGenerator {
    getId(): string {
        const id = crypto.randomBytes(16).toString("hex");

        return id;
    }

}