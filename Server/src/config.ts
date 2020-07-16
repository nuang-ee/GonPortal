export const KEY = {
    db_secret: "SOME_RANDOM_SECRET_KEY",
    sess_secret: "SOME_RANDOM_SESSION_KEY",
}

export const MAIL_MAC = {
    secret: "SOME_RANDOM_SECRET_MAC_KEY",
    validDuration: 10 * 60 * 1000,  // 10 minutes
    ivLength: 12,
    authTagLength: 16,
}