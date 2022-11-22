# Blog API
Backend for [Blog](https://github.com/daniilpogosyan/blog)

To make a server work, it's required to create `.env` file and define variables:
1. MONGODB_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster..."
2. JWT_SECRET="&lt;secret-string&gt;"

## Utilized Technologies
* [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
* [![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
* [![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://www.javascript.com/)

## Features:
* REST API
* Authentication via JSON Web Token
* Storing data in MongoDB
* Differentiated permissions for users
* Ability to publish/unpublish posts

## Possible future features:
* Data validation in Mongoose
* More query parameters for GET requests
