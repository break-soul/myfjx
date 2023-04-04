# -*- coding: utf-8 -*-
# util\node.py

import re
from .enums import Node


# 用方=1546, 用法=1904, 方解=1911, 主治=398, 治则=439, 属经=431, 注意=1
def node(value:str,previous:dict,node_id:int):
    value = re.sub(r"([\u4e00-\u9fa5]+)\s+", r"\1", value)

    try:
        nodes = previous["data"]
    except KeyError:
        nodes = list()
        previous["data"] = nodes

    if node_id == 0 or len(nodes) == 0:
        node = Node()
        nodes.append(node)
    elif node_id == 1:
        node = nodes[-1]
    
    value = value.split("]")
    node_txt = str(value[-1])

    node_txt = re.sub("^ +", "", node_txt)
    node_txt = re.sub("o$", "。", node_txt)

    if node_id == 0:
        node.用方 = re.sub("^.?方(:|：)","",node_txt)
    elif str(value[0]).find("用法") != -1:
        node.用法 = node_txt
    elif str(value[0]).find("方解") != -1:
        node.方解 = node_txt
    elif str(value[0]).find("主治") != -1:
        node.主治 = node_txt
    elif str(value[0]).find("治则") != -1 or str(value[0]).find("佳合蒙") != -1:
        node.治则 = node_txt
    elif str(value[0]).find("属经") != -1 or str(value[0]).find("兴冷") != -1:
        node.属经 = node_txt
    elif str(value[0]).find("注意") != -1:
        node.注意 = node_txt
    else:
        print(str(node_id)+":"+node_txt)

    return node_txt
