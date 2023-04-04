# -*- coding: utf-8 -*-
# util\split.py



from re import compile as re_compile, sub as sub

from util.node import node

from .enums import Status

from typing import Generator

title_1 = re_compile("第.+章")
title_2 = re_compile("^(一|二|三|四|五|六|七|八|九|十|―|―)+、")
title_3 = re_compile("^(\(|（)(一|二|三|四|五|六|七|八|九|十|―|―)+(\)|）)")
title_4 = re_compile("^\d+(\.|-)")
text = re_compile("^\[")
nd = re_compile(".?方(:|：|])")
alias = re_compile("^([a-z|A-Z| ]+|（)")

def new_tittle(father: dict, value: str) -> dict[str, str]:
    child = dict()
    father[value] = child
    try:
        child_group = father["child"]
    except KeyError:
        child_group = list()
        father["child"] = child_group
    finally:
        child_group.append(value)
    return child

def split(contents: Generator) -> dict[str]:
    data = dict()
    # t1=16, t2=212, t3=579, text=5084, fang=1546, none=1057
    # profile from 5.4s to 2s 60%+ upper
    # 通过短路求值来简化条件语句，减少不必要的条件判断，从而提高代码执行效率。
    for value in contents:
        
        if title_1.findall(value):
            try:
                del txt
            except NameError:
                pass
            
            value = sub(r"(\u7ae0)([\u4e00-\u9fa5])", r"\1 \2", value)

            tittle_1 = new_tittle(data, value)
            previous = tittle_1
            # print(value)
        elif title_2.findall(value):
            try:
                del txt
            except NameError:
                pass
            tittle_2 = new_tittle(tittle_1, value)
            previous = tittle_2
            # print("\t"+value)
        elif title_3.findall(value):
            try:
                del txt
            except NameError:
                pass
            value = sub("(―|―)", "一", value)
            tittle_3 = new_tittle(tittle_2, value)
            previous = tittle_3
            # print("\t\t"+value)
        elif title_4.findall(value):
            try:
                del txt
            except NameError:
                pass
            value = sub("-", ".", value)
            tittle_4 = new_tittle(tittle_3, value)
            previous = tittle_4
            # print("\t\t\t"+value)
        elif nd.findall(value):
            txt = node(value, previous, 0)
        elif text.findall(value):
            txt = node(value, previous, 1)
        else:
            value = sub(r'([\u4e00-\u9fa5]+)\s+', r'\1', value)
            value = sub("o$", "。", value)
            try:
                txt = txt + value
            except NameError:
                if alias.findall(value):
                    value = sub("(（|）)", "", value)
                    try:
                        oz = previous["alias"]
                    except KeyError:
                        oz = list()
                        previous["alias"] = oz
                    finally:
                        oz.append(value)
                        continue
                try:
                    title = previous["title"]
                except KeyError:
                    title = list()
                    previous["title"] = title
                finally:
                    title.append(value)

    return data
