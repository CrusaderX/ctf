# Unfurl
![image](https://github.com/user-attachments/assets/71cefee1-9863-4208-beb9-cfe01ee53cea)

Attachment: [challenge.zip](https://github.com/LazyTitan33/CTF-Writeups/raw/refs/heads/main/SnykCon2025/attachments/unfurl.zip)

## Writeup

There are 2 applications started. Main and exposed one makes GET requests to arbitrary URLs, the second one is an admin panel that is supposed to be accessible only from localhost.

Used `find.js` to pinpoint which port the admin panel is exposed at.
