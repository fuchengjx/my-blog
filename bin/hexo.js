#! /usr/bin/env node

const execSync = require('child_process').execSync;

try {
  execSync('hexo g')
  console.log('hexo generator success!')
  execSync('hexo d')
  console.log('hexo deploy success!')
} catch (err) {
  console.log('hexo脚本运行失败：');
  console.log(err.toString());
}