const flag = require('fs')
  .readFileSync('./dump', 'utf-8')
  .split('\n')
  .map(l => /([[a-zA-Z0-9_{}])\.$/.exec(l)?.at(1))
  .filter(Boolean)
  .join('');

console.log(flag);
