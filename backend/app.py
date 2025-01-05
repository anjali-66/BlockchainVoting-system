from flask import Flask
from database import db
from config import Config
from routes import register_routes



#Initialize Flask App


app= Flask(__name__)
app.config.from_objet(Config)

#Initialize database
db.init_app(app)

register_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
