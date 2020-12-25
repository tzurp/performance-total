import crypto from "crypto";

export class IdGenerator {
    getId(prefix?: string): string {
        let init = "";

        if(prefix) {
            init = prefix;
        }

        const id = crypto.randomBytes(16).toString("hex");

        return init + id;
    }
}