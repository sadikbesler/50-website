# Flowbite docs markdown'dan bir başlığın altındaki ilk {{< example >}} kodunu yazdırır
import re,sys
f,h=sys.argv[1],sys.argv[2]
s=open('indirilen/flowbite/content/'+f+'.md').read()
i=s.find('\n## '+h+'\n')
if i<0: i=s.find('\n### '+h+'\n')
if i<0: print('YOK',h); print([m for m in re.findall(r'\n##+ (.*)',s)]); sys.exit()
m=re.search(r'\{\{< example[^>]*>\}\}(.*?)\{\{< /example >\}\}',s[i:],re.S)
out=m.group(1)
out=re.sub(r' d="[^"]{50,}"',' d="…"',out)
print(out.strip())
