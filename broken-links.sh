wget --spider -o logs/wget.log -e robots=off -w 1 -r -p http://localhost:8000/dnd/
grep -B 2 '404' logs/wget.log

