import json
f = open('1-1000.txt', 'r')
words = []

for line in f:
    words.append(line.strip())
f.close()

out = open('1000_common_words.json', 'w')
json.dump(words, out)

