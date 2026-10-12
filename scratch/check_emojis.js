const fs = require('fs');
const path = require('path');

const dir = 'c:/BytePath';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.md'));

// Find any emoji character
const emojiRegex = /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/u;

console.log('--- Checking with Unicode Extended_Pictographic and Emoji_Presentation ---');
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      const match = line.match(/\p{Extended_Pictographic}/gu);
      console.log(`${f}:${idx + 1} [${match ? match.join(' ') : ''}]: ${line.trim()}`);
    }
  });
}

const jsDir = 'c:/BytePath/js';
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).forEach(f => {
    const content = fs.readFileSync(path.join(jsDir, f), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (emojiRegex.test(line)) {
        const match = line.match(/\p{Extended_Pictographic}/gu);
        console.log(`js/${f}:${idx + 1} [${match ? match.join(' ') : ''}]: ${line.trim()}`);
      }
    });
  });
}
