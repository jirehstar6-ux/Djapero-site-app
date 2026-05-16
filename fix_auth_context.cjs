const fs = require('fs');
const file = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

let newContent = file.replace(/const timeoutPromise = new Promise\(\(_, reject\) => \s*setTimeout\(\(\) => reject\(new Error\("AUTH_TIMEOUT"\)\), \d+\)\s*\);\s*const result = await Promise\.race\(\[\s*(.+?),\s*timeoutPromise\s*\]\) as any;/gs, 'const result = await $1;');

fs.writeFileSync('src/context/AuthContext.tsx', newContent);
console.log("Replaced timeout promises");
