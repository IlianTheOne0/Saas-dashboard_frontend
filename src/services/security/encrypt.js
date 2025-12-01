import CryptoJS from "crypto-js";

const encrypt = (key, iv, plainText) =>
{
	if (!plainText) { return ""; }
	const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	return encrypted.toString();
}

export { encrypt };