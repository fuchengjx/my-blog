#! /usr/bin/env node

const execSync = require('child_process').execSync;

try {
  execSync('git add -A')
  let today = new Date().getDate()
  let month = new Date().getMonth() + 1
  let year = new Date().getFullYear() - 2000
  execSync(`git commit -m ${year}-${month}-${today}`)
  console.log(`git commit -m ${year}-${month}-${today}`)
  execSync('git push')
} catch (err) {
  console.log('脚本运行失败：');
  console.log(err.toString());
}