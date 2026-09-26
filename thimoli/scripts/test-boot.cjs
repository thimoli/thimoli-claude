const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const populated of [false,true])for(const lang of ['fr','en','de']){
 let onLoad,reloaded=false;const make=()=>({children:[],setAttribute(){},addEventListener(type,fn){this.handler=fn},append(...children){this.children.push(...children)}});
 const app=make();if(populated)app.children.push('existing');
 const c={window:{addEventListener(type,fn){onLoad=fn}},document:{getElementById:()=>app,documentElement:{lang},createElement:make},location:{reload(){reloaded=true}}};
 vm.runInNewContext(fs.readFileSync('boot-guard.js','utf8'),c);onLoad();
 if(populated)assert.equal(app.children[0],'existing');else{assert.equal(app.children.length,1);const children=app.children[0].children;assert(children[0].textContent);children[2].handler();assert(reloaded);assert.equal(children[3].href,'mailto:contact.thimoli@gmail.com');}
}
console.log('PASS: blank-screen fallback in three languages; existing app untouched.');
