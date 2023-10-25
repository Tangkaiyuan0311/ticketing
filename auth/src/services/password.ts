import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt); // scrypt(...., (err, buf)=>{...});

export class Password {
    // convert a plain-text password into the format stored in the database
    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex");
        const buf = await scryptAsync(password, salt, 64) as Buffer;
        return `${buf.toString("hex")}.${salt}`;
    }

    // compared a plain-text password with the stored encrypted password
    static async equal(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf = await scryptAsync(suppliedPassword, salt, 64) as Buffer;
        return hashedPassword === buf.toString("hex");
    }
}