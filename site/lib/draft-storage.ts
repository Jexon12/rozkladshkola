import {schoolSchema} from './validation';
import {classes,type School} from './school';
export const draftKey='school-editor-draft-v1';
export type StoredDraft={school:School;baseRevision:number;savedAt:string;date?:string;classId?:string};
export function readStoredDraft(raw:string|null):StoredDraft|null{if(!raw)return null;try{const value=JSON.parse(raw),parsed=schoolSchema.safeParse(value.school);return parsed.success&&Number.isSafeInteger(value.baseRevision)&&value.baseRevision>=0&&typeof value.savedAt==='string'&&!Number.isNaN(Date.parse(value.savedAt))?{school:parsed.data as School,baseRevision:value.baseRevision,savedAt:value.savedAt,...(typeof value.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value.date)&&!Number.isNaN(Date.parse(value.date))&&new Date(value.date+'T12:00:00Z').toISOString().slice(0,10)===value.date?{date:value.date}:{}),...(classes.includes(value.classId)?{classId:value.classId}:{})}:null;}catch{return null;}}
