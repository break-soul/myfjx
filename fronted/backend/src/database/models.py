# -*- coding: utf-8 -*-
# src\database\models.py


from py2neo.ogm import GraphObject, Property,RelatedFrom, RelatedTo


class Book(GraphObject):
    __primarykey__ = "name"

    name = Property()
    titles = RelatedTo("Title", "属于")


class Title(GraphObject):
    __primarykey__ = "name"

    name = Property()
    information = Property()
    alias = Property()
    before_book = RelatedFrom(Book, "属于")
    before_title = RelatedFrom("Title", "属于")
    next_title = RelatedTo("Title", "属于")
    next_node = RelatedTo("Node", "用方")


class Node(GraphObject):
    __primarykey__ = "方剂"

    方剂 = Property()
    用法 = Property()
    方解 = Property()
    主治 = Property()
    治则 = Property()
    属经 = Property()
    注意 = Property()
    belongs_to = RelatedFrom(Title, "用方")
