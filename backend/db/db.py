import psycopg2

# Update connection string information
host = "ec2-3-211-6-217.compute-1.amazonaws.com"
dbname = "d2me1o5ljgshr3"
user = "fomchdsnqjstku"
password = "fcc9bdf8b118140b1d24073bc8487f2a177fd61621c3f8177531840d996dd911"
port = 5432
sslmode = "require"


def get_db():
    # Construct connection string
    conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4} port={5}".format(
        host, user, dbname, password, sslmode, port)
    conn = psycopg2.connect(conn_string)
    print("Connection established")
    return conn
