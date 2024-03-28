# Initializing PGUSER
export PGUSER=postgres

# Deletion of the omovies database if it exists
dropdb omovies

# Deletion of user "admin_omovies"
dropuser admin_omovies

# Creation of a database owner user - “admin_omovies”
createuser admin_omovies -P

# Creation of the database
createdb omovies -O admin_omovies