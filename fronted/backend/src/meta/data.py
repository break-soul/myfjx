# -*- coding: utf-8 -*-
# src\meta\data.py

from enum import Enum
from pydantic import BaseModel,Field,validator

def compress_str(s:str,length:int=10):
    if len(s) >= length:
        return s[0:length]
    return s

class TP(Enum):
    BOOK = 0
    TITLE = 1
    NODE = 2

class NextNode(BaseModel):
    name:str
    tp:int
    id:int

    # @validator("name")
    # def check_name(cls,v):
    #     return compress_str(v,7)


class BackData(BaseModel):
    name:str = Field(default="NULL")
    id:int = Field(default=-1)
    tp:int = Field(default=-1)
    pre_node:list[NextNode]= Field(default=[])
    next_node:list[NextNode]= Field(default=[])
    data:dict = Field(default={})
    status:int = Field(default=0)
    
