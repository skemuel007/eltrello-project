# Running Docker Containers in this project
## Run mongodb
`
docker compose -f docker-compose.yml up -d mongodb

docker exec -it mongodatabase bash

docker exec -it mongodatabase mongosh

use eltrello

show collections

db.boards.insert({title: "First board", userId: ObjectId("6439e81374eb45faaeeb3bb2")})

db.boards.find()
`