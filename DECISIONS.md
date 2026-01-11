Ques. Why I chose this database structure 
Ans. First of all I chose SQL over NoSQL because we are dealing with structured data and we want strong acid transactions and strong consistency and SQL databases are made for such use cases.
In the current db schema we can store total booking count for a user for a particular event so that we don't have to aggregate this 
everytime when we create another booking for the same event and for the same user so this is one of the optimization that we can do here
and also we create another table for event booking because both user and event have many to many relationship

Ques2.What other approaches to handling the race condition did you consider, and why did you
reject them?
Ans2. I thought by initially by using constraints at the database schema level but though it will not produce invalid data but then to end user it will show db operation failed to the user but in this case the exact message should be throw to the end client that all the tickets are booked so that's why i went with row locking

3.If this system had to scale to 1 million requests per second, what creates the bottleneck in your current design?
Ans Row locking will increase latency when you will large traffic so we can use queues like rabbitMQ and then process the bookings one by one asynchronously 