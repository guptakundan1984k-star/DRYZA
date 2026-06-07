const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      files = files.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        files.push(file);
      }
    }
  }
  return files;
}

const allFiles = walk('./src');
for (let file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('text-white')) {
    const buttonRegex = /<button[\s\S]*?>/g;
    content = content.replace(buttonRegex, (match) => {
        return match.replace(/text-white/g, 'text-[#0a0a0a]');
    });
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Done replacing button colors.');
