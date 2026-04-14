import os
import mysql.connector
from mysql.connector import Error
import logging
from dotenv import load_dotenv

load_dotenv("backend/.env")

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASS", "12345678"),
            database=os.getenv("DB_NAME", "DBMS_PROJECT"),
            port=int(os.getenv("DB_PORT", "3306")),
            auth_plugin='mysql_native_password'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        logging.error(f"Error while connecting to MySQL: {e}")
        return None
