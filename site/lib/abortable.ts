// Worker termination may leave its RPC promise pending. Abort our own wait too.
export function abortable<T>(promise:Promise<T>,signal:AbortSignal,onLateResult?:(value:T)=>void):Promise<T>{
 return new Promise<T>((resolve,reject)=>{
  let settled=false;
  const abort=()=>{if(settled)return;settled=true;signal.removeEventListener('abort',abort);reject(new DOMException('Скасовано','AbortError'));};
  signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
  promise.then(value=>{if(settled){onLateResult?.(value);return;}settled=true;signal.removeEventListener('abort',abort);resolve(value);},error=>{if(settled)return;settled=true;signal.removeEventListener('abort',abort);reject(error);});
 });
}
