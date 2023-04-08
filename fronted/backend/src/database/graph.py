# -*- coding: utf-8 -*-
# src\database\graph.py

from py2neo import Graph

graph = Graph("neo4j://10.130.32.3:7687", auth=("neo4j", "12345678"))
