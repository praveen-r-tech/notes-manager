# 📝 Notes Manager

A full-stack note-taking application built with **Spring Boot 3**, **MongoDB**, and **React**. Features CRUD operations, pin/archive functionality, search, filtering, pagination, sorting, and file attachment support via MongoDB GridFS.

## 🚀 Features

- ✅ Create, Read, Update, Delete Notes
- 📌 Pin / Unpin Notes
- 📦 Archive / Restore Notes
- 🔍 Search Notes (title, content, tags - case insensitive)
- 🏷️ Filter by tags, pinned, archived status
- 📄 Pagination & Sorting
- 📎 File Attachments (PDF, DOC, DOCX, TXT, PNG, JPG) via GridFS
- 🎨 Modern, Responsive UI
- 📋 Swagger API Documentation

## 🏗️ Architecture

```
notes-manager/
├── backend/                    # Spring Boot 3 + MongoDB
│   ├── src/main/java/com/notesmanager/
│   │   ├── config/            # CORS, Swagger configuration
│   │   ├── controller/        # REST API endpoints
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── entity/            # MongoDB document models
│   │   ├── exception/         # Global exception handler
│   │   ├── mapper/            # Entity-DTO mapping
│   │   ├── repository/        # MongoDB repositories
│   │   ├── service/           # Business logic layer
│   │   └── service/impl/      # Service implementations
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # Axios API service layer
│   │   └── styles/            # CSS styles
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Local Docker development
└── .github/workflows/          # CI/CD pipeline
```

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.4**
- **Spring Data MongoDB**
- **Spring Validation**
- **Lombok**
- **Swagger / OpenAPI (SpringDoc)**
- **Maven**

### Frontend
- **React 18** with **Vite**
- **React Router v6**
- **Axios**
- **Modern CSS** (Flexbox, Grid, Custom Properties)

### Database
- **MongoDB** (Atlas for production, local for development)
- **GridFS** for file storage

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Java 21+
- Node.js 18+
- MongoDB (local or Atlas)
- Maven 3.9+

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/notes-manager.git
cd notes-manager
```

### 2. Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:3000`.

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB locally (if installed)
mongod
```

**Option B: MongoDB Atlas (Free Tier)**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `backend/.env`

## 🐳 Docker Development

```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | Get all notes (paginated) |
| GET | `/api/notes/{id}` | Get note by ID |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |
| PATCH | `/api/notes/{id}/pin` | Toggle pin status |
| PATCH | `/api/notes/{id}/archive` | Toggle archive status |
| GET | `/api/notes/pinned` | Get pinned notes |
| GET | `/api/notes/archived` | Get archived notes |
| GET | `/api/notes/search?keyword=` | Search notes |
| GET | `/api/notes/filter` | Filter notes |
| POST | `/api/notes/{id}/attachment` | Upload attachment |
| DELETE | `/api/notes/{id}/attachment` | Delete attachment |
| GET | `/api/files/{id}/download` | Download file |
| DELETE | `/api/files/{id}` | Delete file |

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`
4. Deploy

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Runtime**: Java 21
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/notes-manager-backend-1.0.0.jar`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL
5. Deploy

### Database (MongoDB Atlas)

1. Create a free cluster
2. Configure network access (allow all IPs for Render)
3. Create a database user
4. Get connection string

## 📸 Screenshots

*Add screenshots here after deployment*

## 🔮 Future Improvements

- [ ] User authentication (JWT)
- [ ] Rich text editor for notes
- [ ] Dark mode
- [ ] Note sharing
- [ ] Tags management page
- [ ] Bulk operations
- [ ] Export notes to PDF
- [ ] Offline support (PWA)

## 📄 License

MIT License - feel free to use this project for learning, portfolio, or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.