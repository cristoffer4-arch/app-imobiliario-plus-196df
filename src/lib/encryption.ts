/**
 * Encryption utilities for OAuth tokens
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
