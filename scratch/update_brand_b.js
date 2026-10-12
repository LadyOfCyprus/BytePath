const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let updatedCount = 0;
files.forEach(f => {
  const filePath = path.join(rootDir, f);
  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('<div class="brand-circle"></div>')) {
    c = c.replace(/<div class="brand-circle"><\/div>/g, '<div class="brand-circle">B</div>');
    fs.writeFileSync(filePath, c, 'utf8');
    updatedCount++;
    console.log(`Updated ${f}`);
  }
});

console.log(`Total files updated: ${updatedCount}`);
