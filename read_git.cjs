const { execSync } = require('child_process');
try {
  const result = execSync('git show HEAD:src/pages/Home.tsx').toString();
  console.log(result);
} catch (e) {
  console.error(e.message);
}
