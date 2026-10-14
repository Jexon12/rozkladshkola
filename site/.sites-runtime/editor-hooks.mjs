export const state=[],memos=[],refs=[];let i=0,m=0,r=0;
export function reset(){i=0;m=0;r=0;}
export function useState(initial){const k=i++;if(!(k in state))state[k]=typeof initial==='function'?initial():initial;return [state[k],v=>state[k]=typeof v==='function'?v(state[k]):v];}
export function useMemo(fn,deps){const k=m++;if(!memos[k]||deps.some((v,j)=>!Object.is(v,memos[k].deps[j])))memos[k]={deps,value:fn()};return memos[k].value;}
export function useRef(v){const k=r++;return refs[k]??=( {current:v} );}export function useEffect(){}
