# -*- coding: utf-8 -*-
# util\io.py

import json
from functools import lru_cache

from docx import Document
from pydantic.json import pydantic_encoder


@lru_cache(10)
def get_docx(path: str) -> Document:
    return Document(path)


def set_json(path: str, data: dict):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, default=pydantic_encoder, ensure_ascii=False)
