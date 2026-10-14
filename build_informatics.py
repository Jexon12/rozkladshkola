from pathlib import Path
ROOT=Path(__file__).resolve().parent
code=(ROOT/'build_homework.py').read_text(encoding='utf-8')
code=code.replace("records=json.loads((ROOT/'homework_extracted.json').read_text(encoding='utf-8'))", "records=json.loads((ROOT/'informatics_homework.json').read_text(encoding='utf-8'))\nfor r in records:\n    r['cls']=8\n    r['semester']=''\n    r['lesson']='Урок '+r['lesson'].lstrip('№')")
code=code.replace('for cls in [7,8,9]:','for cls in [8]:')
code=code.replace('Домашні завдання з фізики {cls} клас НУШ','Домашні завдання з інформатики {cls} клас НУШ')
code=code.replace("path=OUT/f'Домашні завдання {cls} клас НУШ.docx'", "path=OUT/f'Домашні завдання інформатика {cls} клас НУШ.docx'")
code=code.replace("(ROOT/'homework_extracted.json').write_text", "(ROOT/'informatics_homework_verified.json').write_text")
exec(compile(code,str(ROOT/'build_informatics.py'),'exec'))
