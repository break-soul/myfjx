# -*- coding: utf-8 -*-
# util\split.py


from re import compile as re_compile

from util.node import node

from .enums import Status

from typing import Generator

title_1 = re_compile("第.+章")
title_2 = re_compile("(一|二|三|四|五|六|七|八|九|十)+、")
title_3 = re_compile("^(\(|（)")
text = re_compile("^\[")
nd = re_compile(".?方(:|：|])")

def classify(txt:str) -> Status:
    if title_1.findall(txt):
        return Status.TITLE1
    elif title_2.findall(txt):
        return Status.TITLE2
    elif title_3.findall(txt):
        return Status.TITLE3
    elif nd.findall(txt):
        return Status.FANG
    elif text.findall(txt):
        return Status.TEXT
    else:
        return Status.NONE

def split(contents:Generator) -> dict[str]:
    data = dict()
    # t1=16, t2=212, t3=579, text=5084, fang=1546, none=1057

    # profile from 5.4s to 2s 60%+ upper

    # 通过短路求值来简化条件语句，减少不必要的条件判断，从而提高代码执行效率。
    for value in contents:
        match classify(value):
            case Status.TEXT:
                node_id=1
                txt = node(value,previous,node_id)
            case Status.FANG:
                node_id = 0
                txt = node(value,previous,node_id)
            case Status.NONE:
                try:
                    txt = txt + value
                except NameError:
                    try:
                        title = previous["title"]
                    except KeyError:
                        title = list()
                        previous["title"] = title
                    finally:
                        title.append(value)
            case Status.TITLE3:
                try:
                    del txt
                except NameError:
                    pass
                tt3 = dict()
                tt2[value] = tt3
                previous = tt3
            case Status.TITLE2:
                try:
                    del txt
                except NameError:
                    pass
                tt2 = dict()
                tt1[value] = tt2
                previous = tt2
            case Status.TITLE1:
                try:
                    del txt
                except NameError:
                    pass
                tt1 = dict()
                data[value] = tt1
                previous = tt1
    return data
