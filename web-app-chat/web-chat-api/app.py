import os
from app import create_app

config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', '5000'))
    debug = os.getenv('FLASK_DEBUG', 'True')=='True'

    print(f"""
         ===============================================
                Flask Chatbot API server
               configuration:{config_name.upper():<35}
               server:http://{host}:{port}
               Debug Mode: {str(debug):<35}
               API Documentation:
               GET/api/health
               POST/api/chat
               GET /api/conversations
               GET/api/conversations/<id>
               DEL /api/conversations/<id>
               DEL /api/conversations
               GET /api/model/info
         ==================================================      
               """)
    app.run(host=host, port=port, debug=debug)

