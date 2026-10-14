import {build} from 'esbuild';
import {writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
await mkdir('.sites-runtime',{recursive:true});
await writeFile('.sites-runtime/editor-hooks.mjs',`export const state=[],memos=[],refs=[];let i=0,m=0,r=0;
export function reset(){i=0;m=0;r=0;}
export function useState(initial){const k=i++;if(!(k in state))state[k]=typeof initial==='function'?initial():initial;return [state[k],v=>state[k]=typeof v==='function'?v(state[k]):v];}
export function useMemo(fn,deps){const k=m++;if(!memos[k]||deps.some((v,j)=>!Object.is(v,memos[k].deps[j])))memos[k]={deps,value:fn()};return memos[k].value;}
export function useRef(v){const k=r++;return refs[k]??=( {current:v} );}export function useEffect(){}
`);
await build({entryPoints:['app/schedule.tsx'],bundle:true,platform:'node',format:'esm',outfile:'.sites-runtime/editor-component.mjs',packages:'external',plugins:[{name:'hooks',setup(b){b.onResolve({filter:/^react$/},()=>({path:pathToFileURL(process.cwd()+'/.sites-runtime/editor-hooks.mjs').href,external:true}));}}]});
await build({stdin:{contents:'export * from "./lib/school.ts";export * from "./lib/calendar.ts";export * from "./lib/abortable.ts";',resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.sites-runtime/editor-model.mjs'});
const {default:Schedule}=await import('../.sites-runtime/editor-component.mjs');
const {state,memos,reset}=await import('../.sites-runtime/editor-hooks.mjs');
const {seed,editableDayLessons,dayLessons,defaultCalendar,abortable}=await import('../.sites-runtime/editor-model.mjs');
function nodes(node,out=[]){if(!node||typeof node!=='object')return out;if(node.props)out.push(node);for(const c of [node.props?.children].flat(Infinity))nodes(c,out);return out;}
function render(){reset();return nodes(Schedule({canEdit:true}));}
const s=structuredClone(seed);s.weekly['8'][0][0]={subject:'Перша група',room:'ІН',group:'I'};s.weekly['8'][0][1]={subject:'Друга група',room:'ІН',group:'II'};
state[0]=s;state[2]=true;state[6]={date:'2026-10-05',time:'07:00',minutes:420,seconds:0};state[19]='I';render();assert.equal(memos[2].value.lesson.group,'I');
state[19]='II';render();assert.equal(memos[2].value.lesson.group,'II');
state[8]='edit';state[12]=structuredClone(s);state[13]=true;
assert.ok(render().some(n=>typeof n.type==='function'&&n.type.name==='DraftRecovery'),'Draft recovery mounted in the page');
let all=render(),resolve,requests=0;globalThis.fetch=()=>{requests++;return new Promise(r=>resolve=r);};
const save=all.find(n=>n.type==='button'&&n.props.className==='primary-button'&&n.props.children?.some?.(c=>c==='Зберегти')).props.onClick;
const submitted=structuredClone(state[12]),pending=save();await save();assert.equal(requests,1,'Double submission blocked');
all.find(n=>n.type==='input'&&n.props.list==='subjects').props.onChange({target:{value:'Нова правка'}});
resolve({ok:true,json:async()=>({school:submitted,revision:1,updatedAt:new Date().toISOString()})});await pending;
assert.equal(state[12].changes['2026-10-05']['8'][0].subject,'Нова правка');assert.equal(state[13],true);assert.equal(state[1],1);
// A second save includes the new edit and marks the draft clean.
all=render();const saved=structuredClone(state[12]);globalThis.fetch=async()=>({ok:true,json:async()=>({school:saved,revision:2,updatedAt:null})});
await all.find(n=>n.type==='button'&&n.props.className==='primary-button'&&n.props.children?.some?.(c=>c==='Зберегти')).props.onClick();assert.equal(state[13],false);
const holiday=structuredClone(s);holiday.calendar=structuredClone(defaultCalendar);const date='2026-10-26';holiday.changes[date]={'8':structuredClone(s.weekly['8'][0])};
assert.equal(dayLessons(holiday,'8',date).filter(Boolean).length,0);assert.equal(editableDayLessons(holiday,'8',date).filter(Boolean).length,8);
state[7]=date;state[12]=holiday;all=render();all.find(n=>n.type==='input'&&n.props.list==='subjects').props.onChange({target:{value:'Урок після канікул'}});
assert.equal(state[12].changes[date]['8'].filter(Boolean).length,8);
const photo=render().find(n=>typeof n.type==='function'&&n.type.name==='PhotoImport');photo.props.onApply([{classId:'8',slot:1,lesson:{subject:'Заміна з фото',room:'М'}}],date);assert.equal(state[12].changes[date]['8'].filter(Boolean).length,8);
const input=render().find(n=>n.type==='input'&&n.props.accept==='.csv,.json');input.props.onChange({target:{files:[{size:100,name:'changes.csv',text:async()=>`дата;клас;урок;предмет;кабінет;група\n${date};8;3;CSV урок;М;`}],value:''}});await new Promise(r=>setImmediate(r));assert.equal(state[12].changes[date]['8'].filter(Boolean).length,8);assert.equal(state[12].changes[date]['8'][2].subject,'CSV урок');
const controller=new AbortController();let released=false;const wait=abortable(new Promise(()=>{}),controller.signal).finally(()=>released=true);controller.abort();await assert.rejects(wait,{name:'AbortError'});assert.ok(released);
const early=new AbortController();early.abort();await assert.rejects(abortable(Promise.resolve(1),early.signal),{name:'AbortError'});
const late=new AbortController();let finish,cleaned=false;const job=abortable(new Promise(r=>finish=r),late.signal,()=>cleaned=true);late.abort();await assert.rejects(job,{name:'AbortError'});finish({});await new Promise(r=>setImmediate(r));assert.ok(cleaned,'Late worker initialization cleaned up');
console.log('Editor checks passed: group refresh, overlapping saves, edits during save, holiday manual/CSV/OCR preservation, cancellation and late worker cleanup.');
