import CryptoJS from "crypto-js";

const decrypt = (key, iv, cipherText) =>
{
	if (!cipherText) { return ""; }
	const decrypted = CryptoJS.AES.decrypt(cipherText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	return decrypted.toString(CryptoJS.enc.Utf8);
}

export { decrypt };