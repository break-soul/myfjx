from flask import Flask
from src import routes

app = Flask(__name__)

for route in routes.bp:
    app.register_blueprint(route)

if __name__ == "__main__":
    app.run(debug=True)
