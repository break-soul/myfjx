# -*- coding: utf-8 -*-
# util\content.py

from docx import Document

from typing import Generator


def get_content(document: Document) -> Generator[str, None, None]:
    for content in document.paragraphs:
        text = content.text
        if text == "\n" or text == "":
            continue
        try:
            if content._p.numPr is not None:
                num_id = content._p.numPr.numId.val
                ilvl = content._p.numPr.ilvl.val
                num_text = document.part.numbering_systems[
                    document.part.numbering_definitions._numbering.get(
                        num_id)].format(ilvl)
                text = num_text + text
        except AttributeError:
            ...
        yield text
