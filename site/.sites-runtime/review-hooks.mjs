export const state=[],memos=[];let index=0,memoIndex=0;
export function reset(){index=0;memoIndex=0;}
export function useState(initial){const i=index++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],v=>{state[i]=typeof v==='function'?v(state[i]):v;}];}
export function useMemo(fn,deps){const i=memoIndex++;if(!memos[i]||deps.some((d,j)=>!Object.is(d,memos[i].deps[j])))memos[i]={deps,value:fn()};return memos[i].value;}
export function useEffect(){}
export function useRef(v){return {current:v};}
