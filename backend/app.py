from flask import Flask, jsonify, request
from dotenv import load_dotenv
import mysql.connector
import os
import random
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

db_host = os.getenv('MYSQL_HOST')
db_user = os.getenv('MYSQL_USER')
db_password = os.getenv('MYSQL_PASSWORD')
db_name = os.getenv('MYSQL_DATABASE')

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            port=33061
        )
        return conn, conn.cursor(dictionary=True)
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None, None

@app.route('/api/games', methods=['GET'])
def get_games():
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        query = """
            SELECT
                g.gameID, g.title, g.rating, g.description, g.downloads, g.price,
                d.developerID, d.name as developerName,
                GROUP_CONCAT(ge.name SEPARATOR ', ') as genres
            FROM Game g
            JOIN Developer d ON g.developerID = d.developerID
            LEFT JOIN isPartOf ip ON g.gameID = ip.gameID
            LEFT JOIN Genre ge ON ip.genreID = ge.genreID
            GROUP BY g.gameID
        """
        cursor.execute(query)
        games = cursor.fetchall()

        game_list = []
        for game in games:
             game_list.append({
                 'gameID': game['gameID'],
                 'title': game['title'],
                 'rating': game['rating'],
                 'description': game['description'],
                 'downloads': game['downloads'],
                 'price': game['price'],
                 'developer': {
                     'developerID': game['developerID'],
                     'name': game['developerName']
                 },
                 'genres': game['genres']
             })

        return jsonify(game_list), 200
    except mysql.connector.Error as err:
        print(f'Error querying database: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/api/game/<int:game_id>', methods=['GET'])
def get_game_by_id(game_id):
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        query = """
            SELECT
                g.gameID, g.title, g.rating, g.description, g.downloads, g.price,
                d.developerID, d.name as developerName,
                GROUP_CONCAT(ge.name SEPARATOR ', ') as genres
            FROM Game g
            JOIN Developer d ON g.developerID = d.developerID
            LEFT JOIN isPartOf ip ON g.gameID = ip.gameID
            LEFT JOIN Genre ge ON ip.genreID = ge.genreID
            WHERE g.gameID = %s
            GROUP BY g.gameID
        """
        cursor.execute(query, (game_id,))
        game = cursor.fetchone()

        if game:
            game_data = {
                'gameID': game['gameID'],
                'title': game['title'],
                'rating': game['rating'],
                'description': game['description'],
                'downloads': game['downloads'],
                'price': game['price'],
                'developer': {
                     'developerID': game['developerID'],
                     'name': game['developerName']
                 },
                 'genres': game['genres']
            }
            return jsonify(game_data), 200
        else:
            return jsonify({'error': 'Game not found'}), 404
    except mysql.connector.Error as err:
        print(f'Error querying database: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- New Developer Routes ---

@app.route('/api/developers', methods=['GET'])
def get_developers():
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor.execute('SELECT developerID, name FROM Developer')
        developers = cursor.fetchall()
        return jsonify(developers), 200
    except mysql.connector.Error as err:
        print(f'Error querying database: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/api/developer/<int:developer_id>', methods=['GET'])
def get_developer_by_id(developer_id):
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor.execute('SELECT developerID, name FROM Developer WHERE developerID = %s', (developer_id,))
        developer = cursor.fetchone()

        if developer:
            return jsonify(developer), 200
        else:
            return jsonify({'error': 'Developer not found'}), 404
    except mysql.connector.Error as err:
        print(f'Error querying database: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- New WorkshopEntry Routes ---

@app.route('/api/workshop', methods=['GET'])
def get_workshop_entries():
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        query = """
            SELECT
                we.WEID, we.category, we.title, we.description, we.subscriptions,
                g.gameID, g.title as gameTitle,
                u.userID, u.name as userName
            FROM WorkshopEntry we
            JOIN Game g ON we.gameID = g.gameID
            JOIN User u ON we.userID = u.userID
        """
        cursor.execute(query)
        entries = cursor.fetchall()

        workshop_list = []
        for entry in entries:
            workshop_list.append({
                'WEID': entry['WEID'],
                'category': entry['category'],
                'title': entry['title'],
                'description': entry['description'],
                'subscriptions': entry['subscriptions'],
                'game': {
                    'gameID': entry['gameID'],
                    'title': entry['gameTitle']
                },
                'user': {
                    'userID': entry['userID'],
                    'name': entry['userName']
                }
            })
        return jsonify(workshop_list), 200
    except mysql.connector.Error as err:
        print(f'Error querying database: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/api/workshop/<int:workshop_id>', methods=['GET'])
def get_workshop_entry_by_id(workshop_id):
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        query = """
            SELECT
                we.WEID, we.category, we.title, we.description, we.subscriptions,
                g.gameID, g.title as gameTitle,
                u.userID, u.name as userName
            FROM WorkshopEntry we
            JOIN Game g ON we.gameID = g.gameID
            JOIN User u ON we.userID = u.userID
            WHERE we.WEID = %s
        """
        cursor.execute(query, (workshop_id,))
        entry = cursor.fetchone()

        if entry:
             workshop_data = {
                'WEID': entry['WEID'],
                'category': entry['category'],
                'title': entry['title'],
                'description': entry['description'],
                'subscriptions': entry['subscriptions'],
                'game': {
                    'gameID': entry['gameID'],
                    'title': entry['gameTitle']
                },
                'user': {
                    'userID': entry['userID'],
                    'name': entry['userName']
                }
            }
             return jsonify(workshop_data), 200
        else:
            return jsonify({'error': 'Workshop entry not found'}), 404
    except mysql.connector.Error as err:
        print(f'Error querying database: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/api/games/random', methods=['GET'])
def get_random_game():
    conn, cursor = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        # First, get all game IDs
        cursor.execute('SELECT gameID FROM Game')
        game_ids_result = cursor.fetchall()

        if not game_ids_result:
             return jsonify({'error': 'No games found in the database'}), 404

        # Select a random game ID
        random_game_entry = random.choice(game_ids_result)
        random_game_id = random_game_entry['gameID']

        # Now fetch the full details for the randomly selected game
        query = """
            SELECT
                g.gameID, g.title, g.rating, g.description, g.downloads, g.price,
                d.developerID, d.name as developerName,
                GROUP_CONCAT(ge.name SEPARATOR ', ') as genres
            FROM Game g
            JOIN Developer d ON g.developerID = d.developerID
            LEFT JOIN isPartOf ip ON g.gameID = ip.gameID
            LEFT JOIN Genre ge ON ip.genreID = ge.genreID
            WHERE g.gameID = %s
            GROUP BY g.gameID
        """
        cursor.execute(query, (random_game_id,))
        game = cursor.fetchone() # Fetches one row as a dictionary

        if game:
            game_data = {
                'gameID': game['gameID'],
                'title': game['title'],
                'rating': game['rating'],
                'description': game['description'],
                'downloads': game['downloads'],
                'price': game['price'],
                'developer': {
                     'developerID': game['developerID'],
                     'name': game['developerName']
                 },
                 'genres': game['genres']
            }
            return jsonify(game_data), 200
        else:
            # This case should be unlikely if we just got the ID, but handle it just in case
            return jsonify({'error': 'Randomly selected game not found'}), 404

    except mysql.connector.Error as err:
        print(f'Error querying database for random game: {err}')
        return jsonify({'error': 'Database query failed'}), 500
    except Exception as e:
        print(f'An unexpected error occurred: {e}')
        return jsonify({'error': 'An internal server error occurred'}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)