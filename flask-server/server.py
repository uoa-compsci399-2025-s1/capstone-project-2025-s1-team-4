from flask import Flask, g
import sqlite3
import IMedicineRepo as repo
from MedicineRepo import MedicineRepo
from db_con import get_db
from init_db import create_tables


app = Flask(__name__)


# Set up database connection

# connection=sqlite3.connect('medicine.db')
# cursor=connection.cursor()
# create_tables(cursor) ## Function to check if tables already exist, if not then create
# connection.execute("PRAGMA foreign_keys = ON") # enables foreign keys
# connection.commit()


@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Data repository instance
# repo.repo_instance = MedicineRepo(connection)


# Register blueprints (api routes)
from routes import blueprint
app.register_blueprint(blueprint)


# API Sample route
@app.route("/")
def members():
    return {"members": ["member1", "member2", "member3"]}


if __name__ == "__main__":
    app.run(debug=True) # True for development mode

    # initalise database if not existing
    # Create tables on startup
    with sqlite3.connect("medicine.db") as conn:
        from init_db import create_tables
        conn.execute("PRAGMA foreign_keys = ON")
        create_tables(conn.cursor())
        conn.commit()

