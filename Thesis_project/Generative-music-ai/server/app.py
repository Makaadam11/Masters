from flask import Flask
from flask_cors import CORS
from routes.api import api  # Ensure this import matches your project structure

def create_app():
    app = Flask(__name__)
    app.debug = True
    
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    app.register_blueprint(api, url_prefix='/api')
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
