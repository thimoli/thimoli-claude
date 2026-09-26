const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const harness=fs.readFileSync(path.join(__dirname,'smoke-curriculum.js'),'utf8').split('const result = vm.runInContext')[0];
const shell={require,__dirname,process,console,URL,URLSearchParams};vm.runInNewContext(harness+'\nglobalThis.auditContext=context',shell);const c=shell.auditContext;
const results=vm.runInContext(`(() => {
const report={};
for(const language of ['en','de']){
 state.settings.language=language;
 const pages={home:home(),path:pathPage(),review:review(),stats:stats(),profile:profile(),settings:settings(),kural:kuralPage(),pronunciation:pronunciationPractice()};
 for(let village=0;village<12;village++){state.currentVillage=village;pages['village-'+(village+1)]=pathPage();}
 report[language]={};
 for(const [name,html] of Object.entries(pages)){
 const texts=[...new Set(html.replace(/<svg[\\s\\S]*?<\\/svg>/g,'').replace(/<[^>]+>/g,'|~|').split('|~|').map(s=>s.trim()).filter(s=>/[A-Za-zÀ-ÿ]{3}/.test(s)))];
 report[language][name]=texts.filter(s=>translateUiText(s,language)===s);
 }
}
return report;
})()`,c);
for(const language of ['en','de']){
 for(const text of ['Les paires cachées','L’atelier des mots','Le défi du village','Mon sentier','3/10 quêtes parcourues','2/3 liens créés. Les mêmes numéros indiquent tes associations.','Conditions d’utilisation']){
  c.auditText=text;c.auditLanguage=language;assert.notEqual(vm.runInContext('translateUiText(auditText,auditLanguage)',c),text);
 }
}
fs.mkdirSync('output/compliance-audit',{recursive:true});fs.writeFileSync('output/compliance-audit/untranslated-candidates.json',JSON.stringify(results,null,2));
console.log('PASS: new interface labels translated in EN/DE. Remaining unchanged strings saved for review (includes already translated text, names and false positives).');
