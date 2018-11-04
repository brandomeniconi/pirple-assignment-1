# PIRPLE Home Assigment #1

Simple RESTful JSON API that responds 'hello' and 'bye' to the user

# Reference
 *  `GET /hello` -> `{ message: 'Hello!' }`
 *  `GET /hello?name=John` -> `{ message: 'Hello John!' }`
 *  `POST /bye` -> `{ message: 'Bye!' }`
 *  `POST /bye { "name": "John" }` -> `{ message: 'Bye John!' }`