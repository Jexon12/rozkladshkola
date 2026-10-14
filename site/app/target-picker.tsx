"use client";
import {useRef,useState} from 'react';
import {GraduationCap,UsersRound,ChevronDown,Search} from 'lucide-react';
import {classes,type School} from '../lib/school';
type Props={teachers:School['teachers'];audience:'class'|'teacher';classId:string;teacherId:string;onSelect:(kind:'class'|'teacher',id:string)=>void};
export default function TargetPicker({teachers,audience,classId,teacherId,onSelect}:Props){
 const [query,setQuery]=useState(''),ref=useRef<HTMLDetailsElement>(null);
 const label=audience==='class'?`${classId} клас`:teachers.find(t=>t.id===teacherId)?.name||'Оберіть клас або вчителя';
 const normalized=query.trim().toLocaleLowerCase('uk-UA');
 const foundClasses=classes.filter(c=>`${c} клас`.toLocaleLowerCase('uk-UA').includes(normalized)),foundTeachers=teachers.filter(t=>t.name.toLocaleLowerCase('uk-UA').includes(normalized));
 function pick(kind:'class'|'teacher',id:string){onSelect(kind,id);setQuery('');if(ref.current)ref.current.open=false;}
 return <div className="target-picker-wrap"><details className="target-picker" ref={ref} onKeyDown={e=>{if(e.key==='Escape'&&ref.current)ref.current.open=false;}}><summary title="Ваш вибір зберігається на цьому пристрої">{audience==='class'?<GraduationCap size={18}/>:<UsersRound size={18}/>}<span>{label}</span><ChevronDown size={16}/></summary><div className="target-picker-menu"><label><Search size={17}/><input type="search" aria-label="Пошук класу або вчителя" placeholder="Клас або прізвище…" value={query} onChange={e=>setQuery(e.target.value)}/></label>{foundClasses.length>0&&<div><h3>Класи</h3><div className="picker-classes">{foundClasses.map(c=><button key={c} aria-pressed={audience==='class'&&c===classId} onClick={()=>pick('class',c)}>{c}</button>)}</div></div>}{foundTeachers.length>0&&<div><h3>Учителі</h3>{foundTeachers.map(t=><button className="picker-teacher" key={t.id} aria-pressed={audience==='teacher'&&t.id===teacherId} onClick={()=>pick('teacher',t.id)}><UsersRound size={16}/>{t.name}</button>)}</div>}{!foundClasses.length&&!foundTeachers.length&&<p>Нічого не знайдено. Спробуйте інший запит.</p>}</div></details></div>;
}
