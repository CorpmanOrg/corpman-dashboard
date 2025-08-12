import CryptoJS from "crypto-js";

export class StorageUtil {
  private static isBrowser = typeof window !== "undefined";
  private static secretKey = (() => {
    const key = process.env.NEXT_PUBLIC_API_SECURITYKEY;
    if (!key) {
      throw new Error("Missing encryption key: NEXT_PUBLIC_API_SECURITYKEY is not defined.");
    }
    return key;
  })();

  // ==== Encryption helpers =====
  private static encrypt(data: unknown): string {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, this.secretKey).toString();
  }

  private static decrypt(cipherText: string): unknown {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }

  // ==== Session Storage ====
  static setSessionItem(key: string, value: unknown): void {
    if (!this.isBrowser) return;
    const encrypted = this.encrypt(value);
    // sessionStorage.setItem(`__${key}`, JSON.stringify(value));
    sessionStorage.setItem(`__${key}`, encrypted);
  }

  static getSessionItem<T = unknown>(key: string): T | null {
    if (!this.isBrowser) return null;
    const item = sessionStorage.getItem(`__${key}`);
    if (!item) return null;

    try {
      // return JSON.parse(item) as T;
      return this.decrypt(item) as T;
    } catch (error) {
      console.error("Decryption failed", error);
      return null;
    }
  }

  static removeSessionItem(key: string): void {
    if (!this.isBrowser) return;
    sessionStorage.removeItem(`__${key}`);
  }

  static clearSessionItem(): void {
    if (!this.isBrowser) return;
    sessionStorage.clear();
  }

  // ====== Local Storage =======
  static setLocalItem(key: string, value: unknown): void {
    if (!this.isBrowser) return;
    localStorage.setItem(`__${key}`, JSON.stringify(value));
  }

  static getLocalItem<T = unknown>(key: string): T | null {
    if (!this.isBrowser) return null;
    const item = localStorage.getItem(`__${key}`);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      return null;
    }
  }

  static removeLocalItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(`__${key}`);
  }

  static clearLocalItem(): void {
    if (!this.isBrowser) return;
    localStorage.clear();
  }
}
