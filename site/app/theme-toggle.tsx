"use client";
import {useEffect,useState} from 'react';
import {Moon,Sun} from 'lucide-react';

export default function ThemeToggle(){
 const [theme,setTheme]=useState<'dark'|'light'>('dark');
 useEffect(()=>{try{const saved=localStorage.getItem('school-theme');if(saved==='light'){setTheme('light');document.documentElement.dataset.theme='light';}}catch{}},[]);
 function toggle(){const next=theme==='dark'?'light':'dark';setTheme(next);document.documentElement.dataset.theme=next;try{localStorage.setItem('school-theme',next);}catch{}}
 return <button className="theme-toggle" onClick={toggle} aria-label={theme==='dark'?'Увімкнути світлу тему':'Увімкнути темну тему'} title={theme==='dark'?'Світла тема':'Темна тема'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}<span>{theme==='dark'?'Світла':'Темна'}</span></button>;
}
