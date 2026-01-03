# AI Support System

A production-grade intelligent support ticket system powered by AI, demonstrating real-world application of Retrieval-Augmented Generation (RAG) technology with modern backend architecture.

![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

---

## Table of Contents

- [Why This Project](#-why-this-project)
- [How It's Built](#-how-its-built)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Data Ingestion](#-data-ingestion)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Endpoints](#-api-endpoints)

---

##  Why This Project

This project was built to demonstrate:

1. **Real-World AI Integration**: Showcases how modern AI models (Google Gemini) can be integrated into production applications using RAG technology for context-aware responses.

2. **Production-Grade Architecture**: Implements industry-standard patterns including:

   - Asynchronous job processing with worker queues
   - Message queue systems for scalability
   - Vector embeddings for semantic search
   - Streaming responses for better UX

3. **Modern Full-Stack Development**: Combines cutting-edge frontend (Next.js 15, React 19, Tailwind CSS v4) with robust backend architecture.

4. **Performance & Scalability**: Uses Redis for caching and queue management, PostgreSQL for data persistence, and BullMQ for background job processing.

---

##  How It's Built

### Backend Architecture

The backend follows a **microservices-inspired architecture** with the following components:

- **Express.js API Server**: RESTful API endpoints for ticket and message management
- **Worker Queues (BullMQ)**: Asynchronous processing of AI responses to keep the API responsive
- **Redis**: Message queue backbone and caching layer
- **PostgreSQL + Sequelize ORM**: Data persistence for tickets, messages, and knowledge base
- **RAG Pipeline**:
  - LangChain for orchestration
  - Google Gemini for embeddings and text generation
  - Vector similarity search for context retrieval
  - Custom prompt engineering for accurate responses

### Frontend Architecture

- **Next.js 15**: Server-side rendering and React Server Components
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern utility-first styling with custom design system
- **Real-time Updates**: Polling mechanism for live message updates
- **Responsive Design**: Mobile-first approach with adaptive layouts

### AI/RAG Pipeline

1. **Document Ingestion**: Raw text → Chunking → Embedding → Vector storage
2. **Query Processing**: User message → Embedding → Similarity search → Context retrieval
3. **Response Generation**: Context + History + Prompt → Gemini → Structured response
4. **Background Processing**: Queue system ensures non-blocking AI operations

---

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│   Next.js App   │─────▶│  Express API     │─────▶│   PostgreSQL    │
│   (Frontend)    │      │   (Backend)      │      │   (Database)    │
│                 │      │                  │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                 │
                                 │
                         ┌───────▼────────┐
                         │                │
                         │  Redis Queue   │
                         │    (BullMQ)    │
                         │                │
                         └───────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │                │
                         │  AI Workers    │
                         │  (Background)  │
                         │                │
                         └───────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │                │
                         │ Google Gemini  │
                         │   + RAG        │
                         │                │
                         └────────────────┘
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Redis** (v6 or higher)
- **PostgreSQL** (v13 or higher)
- **Google Gemini API Key** ([Get it here](https://ai.google.dev/))

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AI-Support-System
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ai-support-frontend
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_support_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 5. Setup PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ai_support_db;

# Exit psql
\q
```

The database tables will be automatically created when you run the application for the first time (Sequelize auto-sync).

### 6. Start Redis Server

**macOS (Homebrew):**

```bash
brew services start redis
# Or run in foreground
redis-server
```

**Linux:**

```bash
sudo systemctl start redis
# Or run in foreground
redis-server
```

**Windows:**

```bash
# Using WSL or Redis for Windows
redis-server
```

Verify Redis is running:

```bash
redis-cli ping
# Should return: PONG
```

---

## Data Ingestion

The system uses a knowledge base to provide context-aware AI responses. You need to ingest your support documentation into the database.

### 1. Prepare Your Knowledge Base

Edit the document content in `src/scripts/ingestDoc.js`:

```javascript
const longDocument = [
  `
  # YOUR COMPANY INFORMATION
  Add your product documentation, FAQs, policies, etc. here.
  This will be used to generate contextually relevant responses.
  `,
  // Add more documents as needed
];
```

### 2. Run the Ingestion Script

```bash
node src/scripts/ingestDoc.js
```

This script will:

1. Split your documents into manageable chunks (500 characters with 50-character overlap)
2. Generate embeddings for each chunk using Google Gemini
3. Store chunks and embeddings in PostgreSQL
4. Display progress and completion status

**Output Example:**

```
Splitting document into 45 chunks...
✅ Ingestion with chunking complete.
```

### 3. Verify Data Ingestion

```bash
node src/scripts/checkEmbeddings.js
```

This will display the number of knowledge base entries and sample content.

---

## 🏃 Running the Application

You need to run **four separate processes** in different terminal windows:

### Terminal 1: Redis Server

```bash
redis-server
```

### Terminal 2: Backend API Server

```bash
npm run dev
# Or for production:
npm start
```

The API will be available at `http://localhost:3001`

### Terminal 3: AI Worker Process

```bash
node src/workers/aiResponse.worker.js
```

This worker processes AI response jobs from the queue.

### Terminal 4: Frontend Application

```bash
cd ai-support-frontend
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Project Structure

```
AI-Support-System/
├── src/
│   ├── app.js                      # Main Express server
│   ├── ai/
│   │   ├── chain.js                # LangChain RAG pipeline
│   │   ├── embeddings.js           # Google Gemini embeddings
│   │   ├── history.js              # Conversation history management
│   │   ├── llm.js                  # Gemini model configuration
│   │   ├── prompt.js               # System prompts
│   │   ├── ragPrompt.js            # RAG-specific prompts
│   │   └── retriever.js            # Vector similarity search
│   ├── db/
│   │   ├── index.js                # Sequelize database connection
│   │   └── test.connection.js      # Database connection test
│   ├── models/
│   │   ├── index.js                # Model associations
│   │   ├── knowledgeBase.js        # Knowledge base schema
│   │   ├── Message.js              # Message schema
│   │   └── Ticket.js               # Ticket schema
│   ├── queues/
│   │   ├── aiResponse.queue.js     # AI response job queue
│   │   └── email.queue.js          # Email notification queue
│   ├── redis/
│   │   └── redisClient.js          # Redis connection
│   ├── routes/
│   │   ├── job.route.js            # Queue monitoring endpoints
│   │   ├── message.route.js        # Message CRUD operations
│   │   ├── stream.route.js         # Streaming response endpoint
│   │   └── test.route.js           # Health check endpoints
│   ├── scripts/
│   │   ├── checkEmbeddings.js      # Verify knowledge base
│   │   └── ingestDoc.js            # Data ingestion script
│   └── workers/
│       ├── aiResponse.worker.js    # AI response worker
│       └── email.worker.js         # Email notification worker
├── ai-support-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css         # Global styles & design system
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home page (ticket list)
│   │   │   └── tickets/[id]/
│   │   │       └── page.tsx        # Chat page
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx      # Chat interface
│   │   │   ├── CreateTicket.tsx    # Ticket creation form
│   │   │   ├── MessageBubble.tsx   # Message display
│   │   │   ├── MessageInput.tsx    # Message input field
│   │   │   ├── TicketItem.tsx      # Ticket list item
│   │   │   └── TypingIndicator.tsx # AI typing animation
│   │   └── lib/
│   │       ├── api.ts              # API client functions
│   │       └── stream.ts           # Streaming utilities
│   └── public/
│       └── architectureDiagram.png # System architecture image
├── package.json
└── README.md
```

---

## ✨ Features

### Core Features

- ✅ **Ticket Management**: Create, view, and manage support tickets
- ✅ **AI-Powered Responses**: Context-aware answers using RAG technology
- ✅ **Real-time Chat**: Live messaging interface with typing indicators
- ✅ **Background Processing**: Asynchronous AI response generation
- ✅ **Vector Search**: Semantic similarity search for relevant context
- ✅ **Conversation History**: Maintains context across multiple messages
- ✅ **Status Tracking**: Open, In Progress, Resolved ticket statuses

### UI/UX Features

- 🎨 **Modern Design**: Clean, professional interface with dark purple aesthetic
- 📱 **Responsive Layout**: Works seamlessly on desktop and mobile
- ⚡ **Smooth Animations**: Fade-ins, slide-ups, and loading indicators
- 🎭 **Custom Design System**: Consistent color palette and typography
- 🎪 **Tech Carousel**: Auto-scrolling technology showcase
- 🖼️ **Architecture Visualization**: Interactive architecture diagram

---

## 🛠️ Tech Stack

### Backend

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| Node.js + Express      | RESTful API server                   |
| PostgreSQL + Sequelize | Database & ORM                       |
| Redis + BullMQ         | Message queue & caching              |
| Google Gemini          | AI model for embeddings & generation |
| LangChain              | RAG pipeline orchestration           |

### Frontend

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Next.js 15      | React framework with SSR |
| TypeScript      | Type-safe development    |
| Tailwind CSS v4 | Utility-first styling    |
| React Icons     | Icon library             |

---

## 🔌 API Endpoints

### Tickets

#### Get All Tickets
```
GET /tickets
```
**Description:** Retrieves all support tickets, ordered by creation date (newest first)

**Response:**
```json
{
    "message": "Tickets retrieved successfully",
    "data": [
        {
            "id": 1,
            "title": "Cannot access my account",
            "status": "open",
            "createdAt": "2024-01-15T10:30:00Z",
            "updatedAt": "2024-01-15T10:30:00Z"
        }
    ]
}
```

#### Create New Ticket
```
POST /tickets
```
**Request Body:**
```json
{
    "title": "Your question or issue"
}
```

**Response:**
```json
{
    "message": "Ticket created",
    "data": {
        "id": 1,
        "title": "Cannot access my account",
        "status": "open",
        "createdAt": "2024-01-15T10:30:00Z"
    }
}
```

### Messages

#### Get Messages for Ticket
```
GET /tickets/:ticketId/messages
```
**Description:** Retrieves all messages for a specific ticket, ordered chronologically

**Response:**
```json
{
    "message": "Messages retrieved successfully",
    "data": [
        {
            "id": 1,
            "role": "user",
            "content": "I can't log in to my account",
            "TicketId": 1,
            "createdAt": "2024-01-15T10:31:00Z"
        },
        {
            "id": 2,
            "role": "assistant",
            "content": "I can help you with that...",
            "TicketId": 1,
            "createdAt": "2024-01-15T10:31:15Z"
        }
    ]
}
```

#### Send Message to Ticket
```
POST /tickets/:ticketId/messages
```
**Description:** Sends a new message to a ticket and triggers AI response generation

**Request Body:**
```json
{
    "content": "Your message text"
}
```

**Response:**
```json
{
    "message": "Message received. AI is responding...",
    "data": {
        "id": 3,
        "role": "user",
        "content": "Your message text",
        "TicketId": 1,
        "createdAt": "2024-01-15T10:35:00Z"
    }
}
```

**Notes:**
- AI response is processed asynchronously via BullMQ worker
- Poll the GET messages endpoint to retrieve the AI response
- Failed jobs are retried 3 times with exponential backoff

---

## 🎯 Usage

1. **Create a Ticket**: Enter a question or issue on the home page
2. **Start Chatting**: Click on a ticket to open the chat interface
3. **Get AI Responses**: Ask questions and receive context-aware answers
4. **View Status**: Monitor ticket status (Open → In Progress → Resolved)

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Check Redis logs
tail -f /var/log/redis/redis-server.log
```

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Worker Not Processing Jobs

```bash
# Check worker is running
ps aux | grep "aiResponse.worker"

# Check queue in Redis
redis-cli
> KEYS bull:*
> LLEN bull:aiResponse:wait
```

---

## Author

**Shubham Patel/Sanket Patel(both are my name)**

Built as a demonstration of modern AI integration, production-grade architecture, and full-stack development best practices.

---

## Acknowledgments

- Google Gemini for AI capabilities
- LangChain for RAG orchestration
- Next.js team for the amazing framework
- Redis & BullMQ communities

---

**Happy Coding! 🚀**
