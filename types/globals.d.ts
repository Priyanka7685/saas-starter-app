export {};

declare global {
    interface CustomJwtSesssionClaims {
        metadata: {
            role?: "admin";
        };
    }
}