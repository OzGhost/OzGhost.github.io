import re
import json
from sets import Set

f = open('100_word_list.html', 'r')
t = '<a class="word dynamictext" href="/dictionary/">accord</a>'


s = re.compile('<a.*word\sdynamictext.*>\w+<\/a>')
w = re.compile('\w+<\/a>')

words = []

for line in f:
    m = s.match(str(line))
    if m != None:
        w = m.group()
        words.append( w[w.index('>') + 1:-4] )
f.close()

out = open('100words.json', 'w')
json.dump(words, out)

