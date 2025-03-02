# Padding Gambit
![image](https://github.com/user-attachments/assets/1b079028-ef9f-4b0c-a571-5a34ec403851)

Attachment: [Padding_Gambit.7z](https://github.com/LazyTitan33/CTF-Writeups/raw/64fef7c6d09e2b125412107c9db92832f999f515/SnykCon2025/attachments/Padding_Gambit.7z)

## Writeup

The provided source code has `server.js` and `crypto.js`:

```javascript
const crypto = require('crypto')

class Crypto {
  constructor (key, algorithm = `aes-${key.length * 8}-cbc`) {
    this.key = key
    this.algorithm = algorithm
  }

  encrypt (iv, plain) {
    let cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
    return Buffer.concat([cipher.update(plain), cipher.final()])
  }

  decrypt (iv, cipher) {
    let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
    return Buffer.concat([decipher.update(cipher), decipher.final()])
  }
}

exports.Crypto = Crypto
```

Accessing the `/api/token` endpoint allows to create an encrypted token:

```javascript
app.get('/api/token', (req, res) => {
  const encryptedToken = encrypt(tokenCode);
  res.json({ token: encryptedToken });
});
```

Making a POST request on `/api/submit/:token` decrypts the token:

```javascript
/**
 * Vulnerable endpoint that expects the token as part of the URL.
 * Example call: POST /api/submit/<encryptedToken>
 */
app.post('/api/submit/:token', (req, res, next) => {
  const urlToken = req.params.token;
  if (!urlToken) {
    return res.status(400).json({ error: 'Missing token in URL' });
  }

  const decryptionResult = decrypt(urlToken);
  if (!decryptionResult.success) {
    const err = new Error(`Decryption failed: ${decryptionResult.error}`);
    err.statusCode = 400;
    return next(err);
  }

  const submittedCode = req.body.code;
  if (!submittedCode) {
    return res.status(400).json({ error: 'Missing code in request body' });
  }

  if (submittedCode === secretCode) {
    res.json({ message: `Correct code! Flag: ${flag}` });
  } else {
    res.status(400).json({ error: 'Incorrect code' });
  }
});
```
This server has a potential [Padding oracle attack](https://en.wikipedia.org/wiki/Padding_oracle_attack) vulnerability due to how the decrypt function processes encrypted tokens and returns distinct error messages. Since AES-CBC is used, an attacker could exploit this behavior to systematically decrypt the token by observing the errors returned.

```javascript
function decrypt(base64UrlText) {
  try {
    // 1) URL-decode
    const base64Decoded = decodeURIComponent(base64UrlText);

    // 2) Convert from Base64 to a Buffer of raw bytes
    const combinedBuffer = Buffer.from(base64Decoded, 'base64');
    if (combinedBuffer.length < 16) {
      throw new Error('Combined buffer too short to contain IV + ciphertext');
    }

    // 3) IV is the first 16 bytes, ciphertext is the remainder
    const iv = combinedBuffer.slice(0, 16);
    const cipherBytes = combinedBuffer.slice(16);

    // 4) Decrypt
    const plainBuffer = crypt.decrypt(iv, cipherBytes);
    return { success: true, decrypted: plainBuffer.toString('utf8') };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

It's possible to use [padbuster](https://www.kali.org/tools/padbuster/) to get the `tokenCode`.
