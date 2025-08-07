import { randomBytes, createHash } from 'crypto';

export function generateCodeVerifier(): string {
    // Generiere 32 zufällige Bytes
    const buffer = randomBytes(32);
    
    // Konvertiere zu base64url
    return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeChallenge(codeVerifier: string): string {
    // Erstelle SHA-256 Hash
    const hash = createHash('sha256');
    hash.update(codeVerifier);
    const digest = hash.digest();
    
    // Konvertiere zu base64url
    return digest
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}