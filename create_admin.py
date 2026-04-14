import bcrypt
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

# Generate secure password hash
password = "password123"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", "12345678"),
        database=os.getenv("DB_NAME", "demo_1"),
        auth_plugin='mysql_native_password'
    )
    if conn.is_connected():
        cursor = conn.cursor()
        
        # Check if users table exists and insert admin
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password_hash VARCHAR(255),
            role VARCHAR(50),
            department VARCHAR(100),
            is_active BOOLEAN DEFAULT 1
        )
        """)
        
        cursor.execute("""
            INSERT IGNORE INTO users (name, email, password_hash, role, department, is_active) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, ("System Admin", "admin@nexushr.com", hashed, "admin", "HR", 1))
        
        conn.commit()
        print("Admin created successfully! Email: admin@nexushr.com | Password: password123")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        conn.close()
