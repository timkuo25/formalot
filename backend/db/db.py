import psycopg2

# Update connection string information
host = "ec2-52-73-155-171.compute-1.amazonaws.com"
dbname = "dcihqp1n2bj66v"
user = "roetlfqmcenvgu"
password = "f129646353f803a7a9c2fd68bc994d7976b3d078ea0dea6f3ea448e36791972a"
port = 5432
sslmode = "require"


def get_db():
    # Construct connection string
    conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4} port={5}".format(
        host, user, dbname, password, sslmode, port)
    conn = psycopg2.connect(conn_string)
    print("Connection established")
    return conn