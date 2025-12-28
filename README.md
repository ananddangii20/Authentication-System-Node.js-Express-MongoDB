This is a simple authentication system built using Node.js, Express, MongoDB, and EJS.
It includes user registration, login, logout, and protected routes.
The project is beginner-friendly and demonstrates basic full-stack authentication flow.

Features

User Registration (Sign Up)

User Login and Logout

Password hashing using bcrypt

Session-based authentication

Protected routes

EJS templates with HTML and CSS

MongoDB database integration

Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Frontend: EJS, HTML, CSS
Authentication: bcrypt, express-session
Environment variables: dotenv

Project Structure

project-folder
models
routes
views
public
.env
server.js
package.json

Installation and Setup

Navigate to the project folder
cd authentication-system

Install dependencies
npm install

Create a .env file and add the following

PORT=8000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

Start the server
npm start

Open the app in your browser
http://localhost:8000

Environment Variables

PORT – Server port number
MONGO_URI – MongoDB connection string
SESSION_SECRET – Secret key for sessions

Future Improvements

Email verification

Forgot and reset password

JWT authentication

User roles (admin/user)

License
This project is licensed under the MIT License.
