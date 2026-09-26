const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('theme-init.js','utf8');
for(const preference of ['light','dark','system','invalid'])for(const matches of [true,false]){
 const root={dataset:{}};let onChange;
 const meta={};const media={matches,addEventListener:(event,fn)=>onChange=fn};
 const storage=JSON.stringify({settings:{theme:preference},pathProgress:[12]});
 vm.runInNewContext(source,{localStorage:{getItem:()=>storage},window:{matchMedia:()=>media},document:{documentElement:root,querySelector:selector=>({setAttribute:(_,value)=>meta[selector]=value})}});
 assert.equal(root.dataset.theme,preference==='dark'||preference==='system'&&matches?'dark':'light');
 if(preference==='system'){media.matches=!matches;onChange();assert.equal(root.dataset.theme,matches?'light':'dark');}
}
console.log('Theme: light, dark, system, invalid preference and live device change passed.');
