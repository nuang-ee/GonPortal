export const KEY = {
    secret: "SOME_RANDOM_SECRET_KEY",
}

export const MAIL_MAC = {
    secret: "SOME_RANDOM_SECRET_MAC_KEY",
    validDuration: 10 * 60 * 1000,  // 10 minutes
    ivLength: 12,
    authTagLength: 16,
}