# removing sqitch.plan
rm ./migrations/sqitch.plan

# initializing the Sqitch project
sqitch init omovies --engine pg --top-dir ./migrations

# adding migrations
sqitch add init -n 'création des tables'