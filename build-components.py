#!/usr/bin/env python3
"""component-*.frag を components-bundle.js にまとめる。
component を編集したら `python3 build-components.py` を再実行すること。
(file:// で直接開いた時、fetch が使えないため loader.js がこの束を使う)"""
import glob, json, os
here = os.path.dirname(os.path.abspath(__file__))
out = {}
for f in sorted(glob.glob(os.path.join(here, 'component-*.frag'))):
    out[os.path.basename(f)] = open(f, encoding='utf-8').read()
js = '/* 自動生成: build-components.py — 直接編集しないこと */\nwindow.KAKKO_COMPONENTS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
open(os.path.join(here, 'components-bundle.js'), 'w', encoding='utf-8').write(js)
print('bundled', len(out), 'components')
