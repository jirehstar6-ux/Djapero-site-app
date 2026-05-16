const { execSync } = require('child_process');
try {
  const result = execSync('git log -p src/pages/Home.tsx').toString();
  require('fs').writeFileSync('git_history_home.txt', result);
  console.log("Written to git_history_home.txt");
} catch (e) {
  console.error(e.message);
}
