# -*- coding: utf-8 -*-
# util\enums.py

from enum import Enum
from pydantic import BaseModel

class Status(Enum):
    TITLE1=1
    TITLE2=2
    TITLE3=3
    TITLE4=4
    TEXT=11
    NONE=12
    FANG=13

# "源文件无此项内容"

class Node(BaseModel):
    用方:str|None = None
    用法:str|None = None
    方解:str|None = None
    主治:str|None = None
    治则:str|None = None
    属经:str|None = None
    注意:str|None = None
