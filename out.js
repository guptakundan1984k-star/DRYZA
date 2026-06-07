import fs from 'fs';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const buttonRegex = /<button[\s\S]*?>/g;
  content = content.replace(buttonRegex, (match) => {
    return match
      .replace(/text-white/g, 'text-stone-950')
      .replace(/text-stone-50/g, 'text-stone-950')
      .replace(/text-stone-100/g, 'text-stone-950')
      .replace(/text-stone-105/g, 'text-stone-950');
  });
  fs.writeFileSync(file, content, 'utf8');
});
console.log("Done");
