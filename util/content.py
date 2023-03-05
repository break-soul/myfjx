# -*- coding: utf-8 -*-
# util\content.py

from docx import Document

from typing import Generator


def get_content(document: Document) -> Generator[str, None, None]:
    contents: list[str] = document.paragraphs
    for content in contents:
        if content == "\n" or content == "":
            continue
        yield content.text
