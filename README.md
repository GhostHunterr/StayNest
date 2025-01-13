# StayNest

StayNest is a full-stack web application designed to help users find and manage rental property listings. The application supports features like user authentication, reviews, and dynamic maps for viewing listings.

## 🚀 Live Demo

**[StayNest Live Demo](https://stay-nest-nkoy.onrender.com/)**

---

## 📋 Features

- **User Authentication**: Signup, login, and logout functionality for secure access.
- **Dynamic Maps**: Integrated maps with Leaflet.js and OpenCage API to display listing locations.
- **CRUD Operations**: Create, read, update, and delete functionality for listings, reviews, and user profiles.
- **Responsive Design**: Fully responsive UI with EJS templates and CSS for seamless user experience across devices.
- **Error Handling**: Centralized error handling for smooth navigation.
- **Secure Data Management**: MongoDB integration for secure and scalable data storage.

---

## 🔧 Tech Stack

- **Frontend**: EJS (Embedded JavaScript), CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Maps & Geocoding**: Leaflet.js, OpenCage API
- **Hosting**: Render
- **Authentication**: Passport.js
- **Utilities**: Cloudinary for image uploads, Multer for file handling

---

## 🗂 Project Structure

```
STAYNEST
├── controllers/         # Handles business logic
├── init/                # Application initialization
├── models/              # Mongoose models for database
├── public/              # Static assets (CSS, JS)
│   ├── css/
│   └── js/
├── routes/              # Express routes for app endpoints
├── utils/               # Utility functions and middleware
├── views/               # EJS templates for frontend
│   ├── includes/        # Reusable template partials
│   ├── layouts/         # Layout templates
│   ├── listings/        # Listing-related views
│   └── users/           # User-related views
├── .env                 # Environment variables
├── app.js               # Main application entry point
├── middleware.js        # Middleware functions
└── package.json         # Project metadata and dependencies
```

---

## ⚙️ Setup Instructions

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/staynest.git
   cd staynest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Populate the database:
     ```bash
     npm run initdb
     ```

4. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=your-mongodb-connection-string
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-api-secret
   OPENCAGE_API_KEY=your-opencage-api-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   OR
   
6. Start the Production server:
   ```bash
   npm start
   ```

7. Visit the application at `http://localhost:8080`.

---

## 🌟 Future Enhancements

- Add user roles (admin vs. regular users) for better permissions management.
- Enhance search functionality with filters (e.g., price range, location).
- Implement a booking system for rentals.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request for review.

---

## 🖍️ License

This project is licensed under the [MIT License](https://github.com/GhostHunterr/StayNest/blob/main/LICENSE).

