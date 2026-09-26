// Read-only preflight. False values are deliberate blockers, not test failures.
const fs=require('node:fs'),path=require('node:path');
process.chdir(path.resolve(__dirname,'..'));
const readiness=JSON.parse(fs.readFileSync('release-readiness.json','utf8'));
const blockers=Object.entries(readiness).filter(([,value])=>value!==true).map(([key])=>key);
for(const file of ['index.html','legal.html']) {
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
  if(/^(https?:|#|data:)/.test(match[1]))continue;
  if(!fs.existsSync(match[1]))blockers.push(`Missing resource: ${match[1]}`);
 }
}
if(fs.readFileSync('legal.js','utf8').includes('documents préparatoires'))blockers.push('Legal documents still marked as draft');
if(fs.readFileSync('index.html','utf8').includes('pedagogical-index.js'))blockers.push('Free-plan prototype audio still active; regenerate and verify before commercial release');
console.log(JSON.stringify({ready:blockers.length===0,blockers},null,2));
process.exitCode=blockers.length?1:0;
