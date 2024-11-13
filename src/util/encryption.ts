import crypto from "crypto";

// Define a secret key for encryption/decryption (you can use environment variables to keep this secret)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-encryption-key-here"; // 32 characters (256 bits)
const IV_LENGTH = 16; // AES block size

// Encrypt a value
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random initialization vector
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Return IV and encrypted text together
};

// Decrypt a value
export const decrypt = (encrypted: string): string => {
  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Mask the key: show the first 5 characters and mask the rest with stars
export const maskKey = (key: string): string => {
  if (key.length <= 5) {
    return key; // If key length is 5 or less, return as is
  }

  // Calculate how many stars to show based on the length of the key
  const stars = "*".repeat(key.length - 5);

  return key.slice(0, 5) + stars; // Show the first 5 characters and mask the rest with stars
};
