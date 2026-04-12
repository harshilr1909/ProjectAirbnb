# ProjectAirbnb

A server-side rendered Airbnb clone built with Node.js and MongoDB.

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime for building the server
- **Express.js** - Fast, minimalist web framework for Node.js. Handles routing, middleware, and HTTP requests/responses

### Database
- **MongoDB** - NoSQL document database for storing application data
- **Mongoose** - ODM (Object Data Modeling) library for MongoDB. Provides schema validation and object manipulation

### Templating
- **EJS** - Embedded JavaScript templating engine. Renders HTML on the server with dynamic data
- **ejs-mate** - Layout support for EJS (partials, layouts, blocks)

### Authentication
- **Passport.js** - Authentication middleware for Node.js
- **passport-local** - Username/password authentication strategy
- **passport-local-mongoose** - Mongoose plugin for simplified local authentication
- **express-session** - Session middleware for Express

### Validation
- **Joi** - Data validation library for JavaScript objects

### File Handling
- **Multer** - Middleware for handling `multipart/form-data` (file uploads)
- **Cloudinary** - Cloud-based image management service
- **multer-storage-cloudinary** - Multer storage engine for Cloudinary

### Utilities
- **method-override** - Lets you use HTTP verbs like PUT/DELETE in HTML forms
- **connect-flash** - Flash messages for one-time notifications
- **dotenv** - Loads environment variables from `.env` file
- **connect-mongo** - MongoDB session store for express-session

### Development
- **nodemon** - Automatically restarts server on file changes

## Project Structure

```
/home/harshil/ProjectAirbnb
├── index.js              # Main application entry point
├── cloudconfig.js        # Cloudinary configuration
├── package.json          # Dependencies
├── models/               # Mongoose schemas (User, Listing, Review)
├── routes/               # Express route handlers
├── views/                # EJS templates
├── public/               # Static files (CSS, JS, images)
├── middlewares/          # Custom Express middleware
├── utils/                # Utility functions
├── validateSchema/       # Joi validation schemas
└── init/                 # Database initialization scripts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with:
   ```
   ATLAS_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## Features

- User authentication (signup, login, logout)
- Browse vacation listings
- Add new listings with images
- Leave reviews on listings
- Edit and delete listings/reviews
- Filter by category (beach, mountain, camping, etc.)
