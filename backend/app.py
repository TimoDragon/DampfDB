from flask import Flask, jsonify, request
from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()

app = Flask(__name__)

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
        return jsonify({'error', 'Database connection failed'}), 500

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
    
    print(game_id)

    cursor = conn.cursor()
    try:
        cursor.execute('SELECT gameID, title, genreID, rating, description, downloads, price, developerID FROM Game WHERE gameID = %s', (game_id,))
        game = cursor.fetchone()

        game = {
            'gameId': game[0],
            'title': game[1],
            'rating': game[2],
            'description': game[3],
            'downloads': game[4],
            'price': game[5],
            'developerID': game[6],
        }

        return jsonify(game), 200
    except mysql.connector.Error as err:
        print(f'Error quering databse: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)