
# Deletion of the omovies database if it exists
dropdb omovies

# Deletion of user "admin_omovies"
dropuser omovies

# Creation of a database owner user - “admin_omovies”
createuser omovies -P

# Creation of the database
createdb omovies -O omovies
