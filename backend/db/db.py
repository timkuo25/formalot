import psycopg2

# Update connection string information
host = "sdmv2.postgres.database.azure.com"
dbname = "postgres"
user = "chung@sdmv2"
password = "Sdm2022!"
sslmode = "require"


def get_db():
    # Construct connection string
    conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(
        host, user, dbname, password, sslmode)
    conn = psycopg2.connect(conn_string)
    print("Connection established")
    return conn
