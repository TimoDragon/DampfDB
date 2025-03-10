from flask import Flask, jsonify, request
from dotenv import load_dotenv
import mysql.connector
import os
from flask_cors import CORS  # Import Flask-CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

db_host = os.getenv('MYSQL_HOST')
db_user = os.getenv('MYSQL_USER')
db_password = os.getenv('MYSQL_PASSWORD')
db_name = os.getenv('MYSQL_DATABASE')

# --- Database Connection Function ---
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            port=33061
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

@app.route('/api/games', methods=['GET'])
def get_games():
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute('SELECT gameID, title, genreID, rating, description, downloads, price, developerID FROM Game')
        games = cursor.fetchall()

        game_list = []
        for row in games:
            game_list.append({
                'gameId': row[0],
                'title': row[1],
                'rating': row[2],
                'description': row[3],
                'downloads': row[4],
                'price': row[5],
                'developerID': row[6],
            })

        return jsonify(game_list), 200
    except mysql.connector.Error as err:
        print('Error quering databse: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/game/<int:game_id>', methods=['GET'])
def get_game_by_id(game_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error', 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute('SELECT gameID, title, genreID, rating, description, downloads, price, developerID FROM Game WHERE gameID = %s', (game_id,))
        game = cursor.fetchone()

        if game:  # Check if a game was found
            game_data = {
                'gameId': game[0],
                'title': game[1],
                'genreID': game[2],
                'rating': game[3],
                'description': game[4],
                'downloads': game[5],
                'price': game[6],
                'developerID': game[7],
            }
            return jsonify(game_data), 200
        else:
            return jsonify({'error': 'Game not found'}), 404  # Return 404 if not found

    except mysql.connector.Error as err:
        print(f'Error quering databse: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)