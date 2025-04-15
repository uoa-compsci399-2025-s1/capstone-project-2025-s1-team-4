from flask import Flask
import sqlite3
import IMedicineRepo as repo


app = Flask(__name__)

# Data repository instance
#repo.repo_instance = MedicineRepo()


# Set up database connection
from init_db import create_tables
connection=sqlite3.connect('medicine.db')
cursor=connection.cursor()
create_tables(cursor) ## Function to check if tables already exist, if not then create
connection.execute("PRAGMA foreign_keys = ON") # enables foreign keys
connection.commit()


# Register blueprints (api routes)
from routes import blueprint
app.register_blueprint(blueprint)


# API Sample route
@app.route("/")
def members():
    return {"members": ["member1", "member2", "member3"]}


if __name__ == "__main__":
    app.run(debug=True) # True for development mode

connection.close()
