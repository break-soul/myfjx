# -*- coding: utf-8 -*-
# src\routes\api.py

from functools import lru_cache

from flask import Blueprint
from py2neo.matching import NodeMatcher

from src.database.graph import graph
from src.database.models import Book, Title, Node
from src.meta.data import TP, NextNode, BackData

api = Blueprint("api", __name__, url_prefix="/api")

error_data = BackData(status=-1).json()  

@lru_cache(maxsize=128)
def find_by_id(id:int,label:str|None=None):
    node_matcher = NodeMatcher(graph)
    node = node_matcher.get(int(id))
    if not node.has_label(label):
        return None
    return node_matcher.get(int(id))

@api.route("/get_book", methods=["GET"])
def get_book():
    book = Book.match(graph).first()

    next_nodes = list()
    for title in book.titles:
        next_nodes.append(NextNode(name=title.name,id=title.__node__.identity,tp=TP.TITLE.value))

    data = dict()
    data["名称"] = book.name

    return BackData(name = book.name,id=book.__node__.identity, tp=TP.BOOK.value, next_node=next_nodes, data=data).json()

@api.route("/get_title/<tittle_id>", methods=["GET"])
def get_title(tittle_id:int):
    title = find_by_id(tittle_id, "Title")

    if title == None:
        return error_data
    
    try:  
        title = Title.match(graph,title.__name__).first()
    except:
        return error_data

    next_nodes = list()
    for next_title in title.next_tittle:
        next_nodes.append(NextNode(name=next_title.name,id=next_title.__node__.identity,tp=TP.TITLE.value))

    for next_node in title.next_node:
        try:
            next_nodes.append(NextNode(name=next_node.__primarykey__,id=next_node.__node__.identity,tp=TP.NODE.value))
        except:
            next_nodes.append(NextNode(name=next_node.__node__["方解"],id=next_node.__node__.identity,tp=TP.NODE.value))

    data = {k: v for k, v in title.__node__.items() if v}
    data.pop("name")
    data["名称"] = str(title.name).split(".")[-1]

    return BackData(name = title.name, tp=TP.TITLE.value, id=tittle_id,next_node=next_nodes, data=data).json()

@api.route("/get_node/<node_id>", methods=["GET"])
def get_node(node_id:int):
    node = find_by_id(node_id, "Node")

    try:  
        node = Node.match(graph,node["方剂"]).first()
    except:
        return error_data

    data = {k: v for k, v in node.__node__.items() if v}

    return BackData(name = node.方剂, tp=TP.NODE.value, id=node_id, data=data).json()
