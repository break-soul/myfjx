# -*- coding: utf-8 -*-
# src\routes\__init__.py

from .index import bp as index_bp
from .api import api as api_bp

bp = [index_bp, api_bp]
