const CONST = 10000000;
const otpStore = {};

function generateOtp(username) {
    const otp = Math.floor(CONST * Math.random());
    otpStore[username] = otp;
    return otp;
}

function verifyOtp(username, otp) {
    if (otpStore[username] && parseInt(otp) === otpStore[username]) {
        delete otpStore[username];
        return true;
    }
    return false;
}

module.exports = { generateOtp, verifyOtp };
