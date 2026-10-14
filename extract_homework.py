import json, re, urllib.request, concurrent.futures, zipfile, io
from pathlib import Path
from lxml import etree

ROOT=Path(__file__).resolve().parent
records=json.loads((ROOT/'.homework_sources.json').read_text(encoding='utf-8'))
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
def extract(r):
    fileid=re.search(r'/d/([^/]+)',r['url']).group(1)
    req=urllib.request.Request('https://drive.google.com/uc?export=download&id='+fileid,headers={'User-Agent':'Mozilla/5.0'})
    data=urllib.request.urlopen(req,timeout=90).read()
    root=etree.fromstring(zipfile.ZipFile(io.BytesIO(data)).read('word/document.xml'))
    body=root.find('w:body',NS)
    ps=[]
    for el in body:
        if el.tag.endswith('}p'):
            ps.append(''.join(el.xpath('.//w:t/text()',namespaces=NS)).strip())
        elif el.tag.endswith('}tbl'):
            ps.append('[TABLE]')
    idx=[i for i,p in enumerate(ps) if re.search(r'ДОМАШН[ЄЕІЯ]\s+ЗАВДАНН[ЯІ]',p,re.I)]
    out=[]
    if idx:
        for p in ps[idx[-1]+1:]:
            if p=='[TABLE]' or re.match(r'(ДОДАТКОВ|ДОДАТОК|ДОДАТКИ|[IVX]+\.\s+[А-ЯІЇЄҐ]{3})',p): break
            if p: out.append(p)
    r.pop('download',None);r.pop('error',None)
    r['homework']='\n'.join(out)
    r['heading_found']=bool(idx)
    r['paragraphs_after_heading']=ps[idx[-1]+1:] if idx else []
    return r
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    clean=list(pool.map(extract,records))
(ROOT/'homework_extracted.json').write_text(json.dumps(clean,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'count':len(clean),'missing':[r['lesson'] for r in clean if not r['heading_found']], 'empty':[(r['cls'],r['lesson']) for r in clean if not r['homework']], 'long':[(r['cls'],r['lesson'],r['homework']) for r in clean if len(r['homework'])>500]},ensure_ascii=False))
