# Movie Seek

To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

## Motivation

I wanted to build a project from the ground up to create an app where users may find information about their favorite movies.

## Usage

Create an account and login to view details about your favorite movies, directors, and genres. You may also add your favorite movies to your account list to view or modify later. Users may also deregister their account.

[For formatted documentation click here.](https://movie-seek-1949.herokuapp.com/documentation.html)

### Movies

| Request | URL | Method | Parameter | Request Body Data | Response Body Data |
| ------- | --- | ------ | --------- | ----------------- | ------------------ |
| Return a list of ALL movies to the user | /movies | GET | None | None | JSON object holding information about all movies: <br>`[{ _id: "6111c161b96ee25e89c1cc83", Title: "Movie title", Director: { Name: "Director name", Bio: "Director bio", Birth: "Date", Death: null }, Genre: { Name: "Genre name", Description: "Genre description" }, Description: "Movie description", ImagePath: "imagePath.jpg", Featured: true }]` |
| Return data about a single movie by title to the user | /movies/:title | GET | :title | None | JSON object holding information about a single movie <br>`[{ _id: "6111c161b96ee25e89c1cc83", Title: "Movie title", Director: { Name: "Director name", Bio: "Director bio", Birth: "Date", Death: null }, Genre: { Name: "Genre name", Description: "Genre description" }, Description: "Movie description", ImagePath: "imagePath.jpg", Featured: true }]` |
| Return data about a genre by name | /movies/genres/:name | GET | :name | None | JSON object holding information about a genre <br>`{ Name: "Genre name", Description: "Genre description" }` |
| Return data about a director by name | /movies/directors/:name | GET | :name | None | JSON object holding information about a director: <br>`{ Name: "Director name", Bio: "Director bio", Birth: "date", Death: null }` |

### Users

| Request | URL | Method | Parameter | Request Body Data | Response Body Data |
| ------- | --- | ------ | --------- | ----------------- | ------------------ |
| Retrieve full list of users | /users | GET | None | None | JSON object holding information about all users: <br>`[{ _id: "611325bcb96ee25e89c1cc8d", Username: "newMovieUser", Password: "23j3h4jkl1h23jbl1k23jh5lj", Email: "randomEmail@gmail.com", Birthday: "1973-10-14T00:00:00.000Z", FavoriteMovies: [ "611326ddb96ee25e89c1cc92", "61132190b96ee25e89c1cc8a", "611321c7b96ee25e89c1cc8c" ]}]` |
| Allow new users to register | /users | POST | None | JSON object holding information to be created: <br>`{ Username: "newMovieUser", Password: "password1", Email: "randomEmail@gmail.com", Birthday: "November 14, 1973" }` | JSON object holding information about created user: <br>`[{ _id: "611325bcb96ee25e89c1cc8d", Username: "newMovieUser", Password: "23j3h4jkl1h23jbl1k23jh5lj", Email: "randomEmail@gmail.com", Birthday: "1973-10-14T00:00:00.000Z", FavoriteMovies: []}]` |
| Retrieve single user by username | /users/:username | GET | :username | None | JSON object holding information of a single user: <br>`[{ _id: "611325bcb96ee25e89c1cc8d", Username: "newMovieUser", Password: "23j3h4jkl1h23jbl1k23jh5lj", Email: "randomEmail@gmail.com", Birthday: "1973-10-14T00:00:00.000Z", FavoriteMovies: ["611326ddb96ee25e89c1cc92", "61132190b96ee25e89c1cc8a", "611321c7b96ee25e89c1cc8c"]}]` |
| Allow users to update their user info | /users/:username | PUT | :username | JSON object holding information to be updated: <br>`{ Username: "newMovieUser", Password: "password1", Email: "randomEmail@gmail.com", Birthday: "November 14, 1973" }` | JSON object holding information of updated user: <br>`[{ _id: "611325bcb96ee25e89c1cc8d", Username: "newMovieUser", Password: "23j3h4jkl1h23jbl1k23jh5lj", Email: "randomEmail@gmail.com", Birthday: "1973-10-14T00:00:00.000Z", FavoriteMovies: []}]` |
| Allow existing users to deregister | /users/:username | DELETE | :username | None | String mentioning deleted user |
| Allow users to add a movie to their list of favorites | /users/:username/movies/:movieID | POST | :username, :movieID | None | JSON object holding information of updated user: <br>`[{ _id: "611325bcb96ee25e89c1cc8d", Username: "newMovieUser", Password: "23j3h4jkl1h23jbl1k23jh5lj", Email: "randomEmail@gmail.com", Birthday: "1973-10-14T00:00:00.000Z", FavoriteMovies: [ "611326ddb96ee25e89c1cc92", "61132190b96ee25e89c1cc8a", "611321c7b96ee25e89c1cc8c" ]}]` |
| Allow users to remove a movie from their list of favorites | /users/:username/movies/:movieID | DELETE | :username, :movieID | None | JSON object holding information of updated user: <br>`[{ _id: "611325bcb96ee25e89c1cc8d", Username: "newMovieUser", Password: "23j3h4jkl1h23jbl1k23jh5lj", Email: "randomEmail@gmail.com", Birthday: "1973-10-14T00:00:00.000Z", FavoriteMovies: [ "611326ddb96ee25e89c1cc92", "61132190b96ee25e89c1cc8a", "611321c7b96ee25e89c1cc8c" ]}]` |

## Technical Requirements

### Required:

* The API must be a Node.js and Express application.
* The API must use REST architecture, with URL endpoints corresponding to the data operations listed above
* The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
* The API must use a “package.json” file.
* The database must be built using MongoDB.
* The business logic must be modeled with Mongoose.
* The API must provide movie information in JSON format.
* The JavaScript code must be error-free.
* The API must be tested in Postman.
* The API must include user authentication and authorization code.
* The API must include data validation logic.
* The API must meet data security regulations.
* The API source code must be deployed to a publicly accessible platform like GitHub.
* The API must be deployed to Heroku.


## Project Dependencies

* Bcrypt 5.0.1
* Body-parser 1.19.0
* Cors 2.8.5
* Express 4.17.1
* Express-validator 6.12.1
* Jsonwebtoken 8.5.1
* Lodash 4.17.21
* Mongoose 5.13.7
* Morgan 1.10.0
* Passport 0.4.1
* Passport-jwt 4.0.0
* Passport-local 1.0.0

## Built With

* JavaScript
* Node.js
* MongoDB
* Mongoose
* Express

## Hosted on Heroku

App published link: (https://movie-seek-1949.herokuapp.com/)

Run with <br>`node index.js`
