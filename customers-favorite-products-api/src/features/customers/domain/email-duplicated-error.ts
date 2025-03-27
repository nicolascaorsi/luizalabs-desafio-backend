export class EmailDuplicatedError extends Error {
    constructor(email: string) {
        super(`O email ${email} já está em uso.`)
    }
}