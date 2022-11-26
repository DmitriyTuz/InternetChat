1) NodeJS - v.14.19.0; 
   Postgres - v.12.12;
   

2) npm install - for connecting modules for server (from directory "server" - cd server);
   npm install - for connecting modules for client (from directory "client" - cd client);

3) npm start - run server (from directory "server" - cd server);
   npm start - run client (from directory "client" - cd client)
   
4) after server run create please some users for database
Endpoint for it - http://localhost:5000/api/users/createUser
and input for example (in Postmen) - 
   {
      "name": "Алексей",
      "email": "al@mail.com",
      "password": "111"
   }   

5) then open client with run react application and duplicate please 
2 or more windows with this application and in each input please date
of users from database: 
   for example: 
               name - Алексей
               room - room1 (you can input any room)
               email - al@mail.com

6) Do it for 2 or more users from database please and you can to see how
work realtime chat
   
                        По ТЗ для dzenCode:

1) в данном проекте использую SQL СУБД - Postgres и ORM Sequelize
3) что кассается ООП и патернов то могу отметить два:
    - стараюсь чтобы каждая отдельная функция выполняла одну задачу
    - MVC - эту структуру можно увидеть например в папке server в которой
    реализован по сути бэкенд данного приложения. К ней относятся модели
      контроллеры роуты ...
7) работы с файловой системой в NodeJS это модуль 'fs' в данном приложении нет
8) регулярные выражения тоже особо не использовались

P.S. - остальные пункты ТЗ считаю фронтовой частью и в данном приложении она
реализована вот как есть :)