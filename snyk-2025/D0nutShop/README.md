# D0nutShop

D0nutShop CTF Challenge - A web application vulnerable to predictable OTP generation

![image](https://github.com/user-attachments/assets/b9c7c3c3-ec17-44c9-97a3-ae2a3ed99147)

Attachment: [challenge.zip](https://github.com/LazyTitan33/CTF-Writeups/raw/refs/heads/main/SnykCon2025/attachments/donutshop.zip)

## Writeup

`Math.floor(CONST * Math.random())` used to generate OTPs in the source code.

Using `Math.random()` is [not](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) considered cryptographically secure as next value generated can be predicted.


Code in `get-otps.js` was used to request and save N (10) OTPs for a user whose credentials are known.

Used [this gist](https://gist.github.com/1-alex98/0d26a800b5ee0b88ff8b2b550136f259#file-gistfile1-txt-L29) to predict next generated value which matched next OTP generated for admin user.

See [v8-randomness-predictor](https://github.com/PwnFunction/v8-randomness-predictor). 