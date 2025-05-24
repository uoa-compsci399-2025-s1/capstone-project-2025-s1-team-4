from flask import Flask, g
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Close db connection after every requests
@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()


# Register blueprints (api routes)
from routes import blueprint
app.register_blueprint(blueprint)



if __name__ == "__main__":
    # app.run(debug=True) # True for development mode
    app.run(host='0.0.0.0', port=5000, debug=True)

