import psycopg2

# Update connection string information
host = "ec2-107-22-238-112.compute-1.amazonaws.com"
dbname = "ddvopgpa0n86ed"
user = "heddycmvacrihv"
password = "d8a9f07ce5f729f3e3c50841dcf4360b81068ef9ed631ecdc71f7dc18951cb82"
port = 5432
sslmode = "require"


def get_db():
    # Construct connection string
    conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4} port={5}".format(
        host, user, dbname, password, sslmode, port)
    conn = psycopg2.connect(conn_string)
    print("Connection established")
    return conn
