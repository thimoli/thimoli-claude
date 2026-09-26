// No deployment. Build only after all documented release checks are satisfied.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
process.chdir(path.resolve(__dirname,'..'));
const check=cp.spawnSync(process.execPath,['scripts/check-release.cjs'],{stdio:'inherit'});
if(check.status!==0)process.exit(1);
for(const test of ['smoke-curriculum.js','test-learning.js','test-kural-practice.js','test-audio.js','test-storage.js','test-legal.cjs','test-release.cjs','test-boot.cjs','test-exercise-i18n.cjs','test-theme.cjs','test-connectivity.cjs','test-static-package.cjs','test-pedagogy-foundations.cjs','test-next-stage.cjs','test-foundation-flow.cjs','test-sister-feedback.cjs','test-alphabet-review.cjs','test-vocabulary-visuals.cjs']){
 if(cp.spawnSync(process.execPath,[`scripts/${test}`],{stdio:'inherit'}).status!==0)process.exit(1);
}
const output=path.resolve('output',`release-${Date.now()}`);
fs.mkdirSync(output,{recursive:true});
// Explicit runtime allowlist: never copy output, tmp, .git, documents or credentials.
const files=['index.html','app.js','boot-guard.js','i18n-updates.js','curriculum.js','learning-engine.js','learning-ui.js','foundations.js','kural-practice.js','village-adventure.js','styles.css','foundations.css','learning.css','kural-practice.css','village-adventure.css','stats.css','profile.css','legal.html','legal.js','legal.css'];
files.push('i18n-exercises.js','theme-init.js','dark-mode.css','connectivity.js','connectivity.css','vocabulary-visuals.js','vocabulary-visuals.css','sister-feedback.css','alphabet-review.js','alphabet-review.css');
for(const file of files)fs.copyFileSync(file,path.join(output,file));
const allowed=new Set(['.js','.json','.txt','.woff2','.png','.webp','.svg','.jpg','.jpeg','.mp3','.wav','.ogg','.m4a']);
function copyAssets(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const source=path.join(dir,entry.name);if(entry.isSymbolicLink())throw new Error(`Symlink forbidden: ${source}`);
 if(entry.isDirectory()){copyAssets(source);continue;}
 if(!allowed.has(path.extname(source).toLowerCase()))continue;
 const target=path.join(output,source);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);
}}
copyAssets('assets');
fs.writeFileSync(path.join(output,'release-config.js'),'window.THIMOLI_RELEASE=Object.freeze({mode:"production",unlockAll:false});\n');
console.log(`Validated static package: ${output}\nNot deployed. Configure HTTPS and security headers on the selected host.`);
