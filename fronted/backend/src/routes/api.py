# -*- coding: utf-8 -*-
# src\routes\api.py

from functools import lru_cache

from flask import Blueprint,request
from py2neo.matching import NodeMatcher

from src.database.graph import graph
from src.database.models import Book, Title, Node
from src.meta.data import TP, NextNode, BackData

api = Blueprint("api", __name__, url_prefix="/api")

error_data = BackData(status=-1).json()  

@lru_cache(maxsize=128)
def find_by_id(id:int):
    node_matcher = NodeMatcher(graph)
    return node_matcher.get(int(id))


@api.route("/node/<node_id>", methods=["GET"])
def query(node_id:int):
    node = find_by_id(node_id)

    data = dict()
    pre_node = list()
    next_nodes = list()

    try:
        if node.has_label("Book"):
            node = Book.match(graph).first()
            data["名称"] = node.name
            for title in node.titles:
                next_nodes.append(NextNode(name=title.name,id=title.__node__.identity,tp=TP.TITLE.value))
        elif node.has_label("Title"):
            node = Title.match(graph,node.__name__).first()

            for before_title in node.before_title:
                if before_title.__node__.identity == 0 :
                    pre_node.append(NextNode(name=before_title.name,id=before_title.__node__.identity,tp=TP.BOOK.value))
                    continue
                pre_node.append(NextNode(name=before_title.name,id=before_title.__node__.identity,tp=TP.TITLE.value))
                
            for next_title in node.next_title:
                next_nodes.append(NextNode(name=next_title.name,id=next_title.__node__.identity,tp=TP.TITLE.value))
            for next_node in node.next_node:
                try:
                    name = next_node.__node__["方剂"]
                except:
                    name = next_node.__node__["方解"]
                next_nodes.append(NextNode(name=name,id=next_node.__node__.identity,tp=TP.NODE.value))
            data = {k: v for k, v in node.__node__.items() if v}
            data.pop("name")
            data["名称"] = str(node.name).split(".")[-1]
        elif node.has_label("Node"):
            node = Node.match(graph,node["方剂"]).first()

            for title in node.belongs_to:
                pre_node.append(NextNode(name=title.name,id=title.__node__.identity,tp=TP.TITLE.value))
            node.name = node.方剂
            data = {k: v for k, v in node.__node__.items() if v}
        else:
            return error_data
    except:
        raise
        return error_data
    
    return BackData(name = node.name,id=node.__node__.identity, tp=TP.BOOK.value,pre_node=pre_node, next_node=next_nodes, data=data).json()

@api.route("/search", methods=["GET"])
def search():
    kw = request.args.get("kw")
    if kw == None:
        return error_data
    
    node_matcher = NodeMatcher(graph)
    nodes = node_matcher.match("Node", 方剂=kw).all()
    
