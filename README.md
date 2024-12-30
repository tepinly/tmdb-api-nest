# TMDB API - in Nestjs

The idea of the project is to obtain data from the official TMDB and use it for user interaction. Such as searching up movies, adding them to favorites, and rating them

## Setup

Set the environment values necessary, the only environments that need assignment before running the server would be the `TMDB` ones, the rest would run fine if left without being configured

**1 - Using Docker**
The project can be easily setup & run the project right away with

```cmd
docker-compose up
```

**2 - Locally**
To setup locally,  mysql and redis servers are needed to be up & running first. Then run the following commands

```cmd
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run start
```

Those will migrate and populate the database, then run the server

### Tests

To run tests:

```cmd
npm run test
```

## Abstract

The project is built with Nestjs for the backend, MySQL for the database and Redis for caching.

The structure followed is service-oriented, using

- Controllers to handle requests
- Services to handle the logic
- Repositories to handle the database and cache management

----------

# Database schema

## Core Models

### Movie Model

The Movie model represents films in the database with TMDB integration

```typescript
Movie {
  id: number          // Auto-incrementing primary key
  tmdbId: number      // Unique TMDB identifier
  title: string       // Movie title
  ratingAvg: float    // Average user rating
  ratingCount: number // Total number of ratings
  releaseDate: Date   // Movie release date
  createdAt: Date     // Record creation timestamp
  updatedAt: Date     // Last update timestamp
}
```

### User Model

The User model handles user accounts and authentication.

```typescript
User {
  id: number         // Auto-incrementing primary key
  username: string   // Unique username
  email: string      // Unique email address
  password: string   // Hashed password (optional)
  role: Role         // USER or ADMIN
  createdAt: Date    // Record creation timestamp
  updatedAt: Date    // Last update timestamp
}

```

### Genre Model

The Genre model manages movie categories from TMDB.

```typescript
Genre {
  id: number      // Auto-incrementing primary key
  tmdbId: number  // Unique TMDB genre identifier
  name: string    // Unique genre name
}
```

## Relationship Models

### UserMovie Model

Manages the relationship between users and movies, including ratings and favorites

```typescript
UserMovie {
  userId: number     // Reference to User
  movieId: number    // Reference to Movie
  rating: number     // User's rating (optional)
  isFavorite: boolean // Favorite status
  createdAt: Date    // Record creation timestamp
  updatedAt: Date    // Last update timestamp
}
```

### GenreMovie Model

Maps the many-to-many relationship between genres and movies

```typescript
GenreMovie {
  genreTmdbId: number // Reference to Genre's TMDB ID
  movieTmdbId: number // Reference to Movie's TMDB ID
}
```

> [!NOTE]
> The reason `TmdbId` is being used here instead of their own ids is to facilitate seeding the database and directly establishing the relationships based on their existing ids in TMDB

## Enums

### Role

```typescript
enum Role {
  USER    // Standard user access
  ADMIN   // Administrative access
}
```

----------

# API

> [!IMPORTANT]
> The API is prefixed with a `/api` for all endpoints

## Movies

Base URL is `/movies`

### **Endpoints**

#### **1. Get All Movies**

- **URL:** `GET /`
- **Description:** Retrieves a list of all movies, optionally filtered by a search query
- **Query Parameters:**
  - `search` (optional): A string to search for movies by title or other criteria
- **Response:**
  - An array of movies

----------

#### **2. Get Paginated Movies**

- **URL:** `GET /paginated`
- **Description:** Retrieves a paginated list of movies, optionally filtered by a search query and genres
- **Query Parameters:**
  - `page` (optional): Page number (default is `1`)
  - `limit` (optional): Number of movies per page (default is `5`)
  - `search` (optional): A string to search for movies by title or other criteria
  - `genres` (optional): A comma-separated list of genres to filter the movies
- **Response:**
  - A paginated list of movies including metadata *(result, page, limit, total)*

----------

#### **3. Get Movie By ID**

- **URL:** `GET /:id`
- **Description:** Retrieves details of a specific movie by its ID
- **Path Parameters:**
  - `id`: The ID of the movie
- **Response:**
  - Details of the requested movie

----------

#### **4. Rate a Movie**

- **URL:** `POST /:id/rate`
- **Description:** Allows an authenticated user to rate a movie
- **Path Parameters:**
  - `id`: The ID of the movie
- **Request Body:**
  - `rating`: A numerical rating for the movie
- **Headers:**
  - `Authorization`: Bearer token for user authentication
- **Guards:**
  - Requires `JwtAuthGuard`
- **Response:**
  - An empty object `{}` to confirm the action

----------

#### **5. Favorite a Movie**

- **URL:** `POST /:id/favorite`
- **Description:** Allows an authenticated user to mark a movie as a favorite
- **Path Parameters:**
  - `id`: The ID of the movie
- **Headers:**
  - `Authorization`: Bearer token for user authentication
- **Guards:**
  - Requires `JwtAuthGuard`
- **Response:**
  - An empty object `{}` to confirm the action

----------

## **Authentication**

Base URL is `/auth`

### Endpoints

#### **1. Login**

- **URL:** `POST /login`
- **Description:** Authenticates a user and returns an access token if the credentials are valid
- **Request Body:**
  - `username` (required): The username of the user
  - `password` (required): The password of the user
- **Response:**
  - **Success (Valid Credentials):**
    - A JSON object containing an access token
  - **Failure (Invalid Credentials):**
    - A JSON object with a message indicating invalid credentials

----------

# Missing features

- [ ] More type safety for controllers and services
- [ ] More user CRUD endpoints
- [ ] Authorization (Role guard is implemented but not used)
