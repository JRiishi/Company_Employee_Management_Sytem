import mysql.connector
from mysql.connector import Error
try:
    db=mysql.connector.connect(
        host='localhost',
        user='root',
        password='123456789',
        database='demo_1',
        auth_plugin='mysql_native_password'
    )
    if db.is_connected():
        print("Connection Successful!")
        cursor=db.cursor()
        cursor.execute("show tables")
        tables=cursor.fetchall()
        for table in tables:
            print(table)
        print("Which table do you want to access?")
        table_name=input("Enter the table name:")
        cursor.execute(f"select * from {table_name}")
        rows=cursor.fetchall()
        for row in rows:
            print(row)
        cursor.execute(f"SHOW COLUMNS FROM {table_name};")
        columns=cursor.fetchall()
        print(f"COULMNS:\n\n\n\n{columns}")
        print("Columns in the table:")
        for column in columns:
            print(column[0])
            print(column[1])
        print("\n\n\n\n")

    else:
        print("Connection Failed!")
except Error as err:
    if err.errno == 1045:
        print("Error: Wrong username or password")



'''
Student table structure:
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| roll_no | int         | YES  |     | NULL    |       |
| name    | varchar(30) | YES  |     | NULL    |       |
| Fname   | varchar(20) | YES  |     | NULL    |       |
| address | varchar(20) | YES  |     | NULL    |       |
| Contact | int         | YES  |     | NULL    |       |
| DOB     | date        | YES  |     | NULL    |       |
| Fee     | float       | YES  |     | NULL    |       |
+---------+-------------+------+-----+---------+-------+'''