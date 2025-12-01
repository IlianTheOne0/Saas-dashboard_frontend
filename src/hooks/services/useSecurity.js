import CryptoJS from "crypto-js";

import { encrypt } from "../../services/security/encrypt";
import { decrypt } from "../../services/security/decrypt";

import { useCallback } from "react";

const keys = require("../../config/encryption_keys.json");

const key = CryptoJS.enc.Hex.parse(keys.key);
const iv = CryptoJS.enc.Hex.parse(keys.iv);

function useSecurity()
{
	const encryptData = useCallback((plainText) => { return encrypt(key, iv, plainText); }, []);
    const decryptData = useCallback((cipherText) => { return decrypt(key, iv, cipherText); }, []);

	return { encryptData, decryptData };
}

export { useSecurity };