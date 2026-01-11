Just run docker compose up for running the docker container

Three endpoints
1. create event POST - (http://localhost:3000/event)
   body = {title:'Concert', totalTicketsCount:0}
2. create booking POST - (http://localhost:3000/:eventId/booking)
    body - {userId: 1, ticketsCount: 4}
3. delete booking - DELETE - (http://localhost:3000/:eventId/booking/:id)


Can check seeder file for database schema