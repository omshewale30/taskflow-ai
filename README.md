# TaskFlow AI

TaskFlow AI is an application that processes meeting notes using artificial intelligence to generate summaries, extract actionable tasks, and help manage these tasks efficiently.

## Features

- User authentication (signup, login, logout)
- Meeting notes input and AI processing
- AI-generated summaries and task extraction
- Task management (viewing, editing, status updates)
- Responsive dark-themed UI

## Tech Stack

- **Frontend:** Next.js (App Router) with Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database & Authentication:** Supabase (PostgreSQL and Auth)
- **AI:** Langchain with OpenAI

## Project Setup

### Frontend Setup

1. Navigate to the project root directory
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env` and fill in your credentials
3. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

### Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Set up authentication (Email/Password provider)
3. Run the SQL migrations found in `supabase/migrations` to create the necessary tables

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`.env`)
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL_NAME=gpt-3.5-turbo
FRONTEND_URL=http://localhost:3000
```

## Core Workflow

1. User signs up/logs in
2. User inputs meeting notes on the dashboard
3. AI processes the notes to generate a summary and extract tasks
4. User reviews the AI-generated results and can edit tasks
5. User saves the tasks
6. User can view and manage all tasks on the tasks page