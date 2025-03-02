// Welcome! I've recently gotten into mountaineering, so I came up with this fun little quiz game.
// Just answer 50 questions for me!

// Note: Height is measured in feet with no comma (e.g., 28129).
// If the peak has not been summited, write none; otherwise, specify the year of the first ascent.
// Answer with comma-separated values, (e.g., `height,year`)

const spawn = require('child_process').spawn;

const rawMountains = require('./mountains.json');
const MountainMap = rawMountains.reduce((m, i) => {
  m[i.name] = [i.height.replace(',',''), i.first].join(',');
  return m;
}, {});

console.log(MountainMap)

const play = () => new Promise((resolve, reject) => {
  const nc = spawn('nc', ['challenge.ctf.games', '30822']);

  nc.on('message', (msg) => {
    console.log('PARENT got message: ', msg)
  });
  
  nc.stdout.on('data', (data) => {
    const str = data.toString();
    if (str.includes('Do you want to give it a chance? (Y/n):')) {
      nc.stdin.write('Y');
    } else if (str.includes('What is the height and first ascent year of')) {
      const spl = str.split('What is the height and first ascent year of');
      const mountain = spl.at(-1).slice(1, -2);
      console.log(str);
      console.log(mountain, MountainMap[mountain])
      nc.stdin.write(MountainMap[mountain]);
    } else if (str.includes('Awesome, good luck!')) {
      //noop
    } else {
      console.log(str);
      resolve(str);
    }
  });
  
  nc.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  nc.on('close', (code) => {
    // console.log(`child process exited with code ${code}`);
  });
})

const main = async() => {
  console.log(await play());
}

main();