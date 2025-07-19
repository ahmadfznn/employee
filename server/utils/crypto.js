const {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
} = require("crypto");
const { AES, enc } = require("crypto-js");

const Crypto = {
  encrypt(text) {
    const encryptedText = AES.encrypt(text, process.env.SECRET_KEY).toString();
    return encryptedText;
  },

  decrypt(text) {
    const decryptedText = AES.decrypt(text, process.env.SECRET_KEY).toString(
      enc.Utf8
    );
    return decryptedText;
  },

  generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    return { publicKey, privateKey };
  },

  encryptMessage(publicKey, message) {
    const encrypted = publicEncrypt(publicKey, Buffer.from(message, "utf8"));

    return encrypted.toString("base64");
  },

  decryptMessage(privateKey, encryptedMessage) {
    const decrypted = privateDecrypt(
      privateKey,
      Buffer.from(encryptedMessage, "base64")
    );

    return decrypted.toString();
  },
};

module.exports = Crypto;
