export interface JWTPayload {
    sub: string
    exp: number
    scopes?: string[]
}