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

## 🚢 Production Deployment

### Prerequisites
- GitHub repository
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas cluster

### Step 1: MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (`0.0.0.0/0`) or your Render IP
4. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/notesmanager?retryWrites=true&w=majority
   ```

### Step 2: Backend Deployment (Render)

1. Go to [Render](https://render.com) and create a new **Web Service**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `notes-manager-backend`
   - **Environment**: Docker
   - **Branch**: main
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
4. Set environment variables:
   ```
   MONGODB_URI=<your-atlas-connection-string>
   JWT_SECRET=<strong-random-secret-min-32-chars>
   JWT_EXPIRATION=86400000
   ALLOWED_ORIGINS=https://your-app.vercel.app
   SERVER_PORT=8080
   ```
5. Deploy the service
6. Copy your Render backend URL (e.g., `https://notes-manager-backend.onrender.com`)

### Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com) and create a new project
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables:
   ```
   VITE_API_BASE_URL=https://notes-manager-backend.onrender.com
   ```
5. Deploy the project
6. Copy your Vercel frontend URL (e.g., `https://notes-manager.vercel.app`)

### Step 4: Update CORS

1. Go back to your **Render** backend service
2. Update the `ALLOWED_ORIGINS` environment variable to include your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
   ```
3. Redeploy the backend service

### Step 5: Update Frontend URL in Backend

1. Go to **Render** backend service settings
2. Update `ALLOWED_ORIGINS` with your final Vercel URL
3. Redeploy

## 🔮 Future Improvements

- [x] User authentication (JWT) ✅
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