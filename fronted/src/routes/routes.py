from flask import Blueprint, jsonify, render_template
from py2neo import Graph
from .database.models import Book, Title, Node

bp = Blueprint("routes", __name__)


@bp.route("/")
def index():
    return render_template("index.html")

@bp.route("/get_books/")
def get_books():
    books = Book.match(graph).all()
    return jsonify([{"name": book.name} for book in books])

@bp.route("/get_titles/<book_name>")
def get_titles(book_name):
    book = Book.match(graph, book_name).first()
    titles = list(book.titles)

    response_data = [
        {
            "name": title.name,
            "type": "Title"
        }
        for title in titles
    ]

    return jsonify(response_data)

@bp.route("/get_nodes/<title_name>")
def get_nodes(title_name):
    title = Title.match(graph, title_name).first()
    nodes = []

    nodes.extend(list(title.parent_title))
    nodes.extend(list(title.belongs_to))

    response_data = [
        {
            "name": node.name if isinstance(node, Title) else node.fj,
            "type": "Title" if isinstance(node, Title) else "Node",
        }
        for node in nodes
    ]

    return jsonify(response_data)


