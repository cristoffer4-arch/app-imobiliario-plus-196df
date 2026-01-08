/**
 * Encryption utilities for OAuth tokens
 * 
 * SECURITY NOTE: The XOR encryption used here is provided to match the
 * specification requirements, but is NOT cryptographically secure for
 * production use. XOR encryption with a repeating key is vulnerable to:
 * - Frequency analysis attacks
 * - Known-plaintext attacks
 * - Pattern detection
 * 
 * For production deployments, replace this with a proper encryption
 * algorithm such as AES-256-GCM from Node.js crypto module:
 * 
 * import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
 * 
 * function aesEncrypt(plaintext: string, key: Buffer): string {
 *   const iv = randomBytes(16);
 *   const cipher = createCipheriv('aes-256-gcm', key, iv);
 *   const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
 *   const tag = cipher.getAuthTag();
 *   return Buffer.concat([iv, tag, encrypted]).toString('base64');
 * }
 */

/**
 * XOR decryption function
 * @param encrypted - Base64 encoded encrypted string
 * @param key - Encryption key from environment
 * @returns Decrypted string
 */
export function xorDecrypt(encrypted: string, key: string): string {
  try {
    // Decode from base64
    const encryptedBuffer = Buffer.from(encrypted, 'base64');
    const keyBuffer = Buffer.from(key, 'utf-8');
    
    // XOR decrypt
    const decrypted = Buffer.alloc(encryptedBuffer.length);
    for (let i = 0; i < encryptedBuffer.length; i++) {
      decrypted[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    return decrypted.toString('utf-8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * XOR encryption function
 * @param plaintext - Plain text to encrypt
 * @param key - Encryption key from environment
 * @returns Base64 encoded encrypted string
 */
export function xorEncrypt(plaintext: string, key: string): string {
  try {
    const plaintextBuffer = Buffer.from(plaintext, 'utf-8');
    const keyBuffer = Buffer.from(key, 'utf-8');
    
    // XOR encrypt
    const encrypted = Buffer.alloc(plaintextBuffer.length);
    for (let i = 0; i < plaintextBuffer.length; i++) {
      encrypted[i] = plaintextBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    // Encode to base64
    return encrypted.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt token');
  }
}
