1) NodeJS - v.14.19.0; 
   Postgres - v.12.12;

2) npm install - for connecting modules for server (from directory "server" - cd server);
   npm install - for connecting modules for client (from directory "client" - cd client);

3) npm start - run server (from directory "server" - cd server);
   npm start - run client (from directory "client" - cd client)
   
4) after server run create please some users for database
endPoint for it - http://localhost:5000/api/users/createUser
and input for example (in Postmen) - 
   {
      "name": "Alex",
      "email": "al@mail.com",
      "password": "111"
   }   

5) then open client with run react application and duplicate please 
2 or more windows with this application and in each input please date
of users from database: 
   for example: 
               name - Alex
               room - room1 (you can input any room)
               email - al@mail.com

6) Do it for 2 or more users from database please and you can to see how
work realtime chat
   