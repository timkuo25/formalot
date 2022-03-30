import sqlite3

# connect database

DATABASE_NAME = "backend/db/formalot.db"


def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row  # name-based access to columns
    return conn
