# -*- coding: utf-8 -*-
# main.py

import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='gb18030')

from util.io import get_docx, set_json
from util.split import split
from util.content import get_content

path = "res\苗药方剂学_pre1.docx"

document = get_docx(path=path)
contents = get_content(document=document)

data = split(contents=contents)

set_json(path="res\苗药方剂学_pre3.json", data=data)
