// Read-only runtime checks. No network, publishing or changes to user progress.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
process.chdir(path.resolve(__dirname,'..'));
const runtime=new Set(['index.html','legal.html']);
for(const entry of [...runtime]){
 const html=fs.readFileSync(entry,'utf8');
 for(const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)){
  const file=match[1];if(/^(?:[a-z]+:|\/\/|#)/i.test(file))continue;
  assert(fs.existsSync(file),'Missing resource: '+file);runtime.add(file);
 }
}
for(const file of runtime){
 assert(fs.existsSync(path.join('dist',file)),'Missing preview resource: '+file);
 assert(fs.readFileSync(file).equals(fs.readFileSync(path.join('dist',file))),'Stale preview resource: '+file);
 if(file.endsWith('.css'))for(const match of fs.readFileSync(file,'utf8').matchAll(/url\(\s*['"]?([^\s)'"?#]+)(?:[?#][^)'"\s]*)?['"]?\s*\)/g)){
  if(/^(?:[a-z]+:|\/\/)/i.test(match[1]))continue;
  assert(fs.existsSync(path.resolve(path.dirname(file),match[1])),'Missing CSS resource: '+match[1]);
 }
}
console.log('PASS: '+runtime.size+' runtime files exist and match the local preview; CSS asset references checked.');
