# -*- coding: utf-8 -*-
# src\meta\data.py

from enum import Enum
from pydantic import BaseModel,Field

class TP(Enum):
    BOOK = 0
    TITLE = 1
    NODE = 2

class NextNode(BaseModel):
    name:str
    tp:int
    id:int

class BackData(BaseModel):
    name:str = Field(default="NULL")
    id:int = Field(default=-1)
    tp:int = Field(default=-1)
    next_node:list[NextNode]= Field(default=[])
    data:dict = Field(default={})
    status:int = Field(default=0)
