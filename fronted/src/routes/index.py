# -*- coding: utf-8 -*-
# src\routes\index.py

from flask import Blueprint, render_template

bp = Blueprint("index", __name__)


@bp.route("/")
def index():
    return render_template("index.html")
