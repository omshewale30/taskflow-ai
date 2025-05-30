from supabase import create_client, Client
from uuid import UUID
from typing import List, Dict, Any, Optional
from datetime import date, timedelta, datetime
from app.core.config import settings

# Initialize Supabase client
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_ROLE_KEY
)

# Meeting Notes Operations
async def create_meeting_note(user_id: UUID, original_text: str, summary: str) -> Dict[str, Any]:
    """Create a new meeting note in the database"""
    try:
        response = supabase.table("meeting_notes").insert({
            "user_id": str(user_id),
            "original_text": original_text,
            "summary": summary
        }).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise Exception("Failed to create meeting note")
    except Exception as e:
        print(f"Error in create_meeting_note: {e}")
        raise e

async def get_meeting_note_by_id(note_id: UUID, user_id: UUID) -> Optional[Dict[str, Any]]:
    """Get a meeting note by ID, ensuring it belongs to the specified user"""
    try:
        response = supabase.table("meeting_notes").select(
            "id, original_text, summary, created_at"
        ).eq("id", str(note_id)).eq("user_id", str(user_id)).limit(1).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error in get_meeting_note_by_id: {e}")
        raise e

# Tasks Operations
async def create_tasks_batch(user_id: UUID, note_id: UUID, tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Create multiple tasks in a batch operation"""
    try:
        # Prepare tasks with user_id and note_id
        task_records = []
        for task in tasks:
            task_record = {
                "user_id": str(user_id),
                "note_id": str(note_id),
                "description": task["description"],
                "status": "open",  # Default status
                "is_important": task.get("is_important", False)  # Default to False if not provided
            }
            
            # Add due_date if provided, converting to string if it's a date object
            if "due_date" in task and task["due_date"]:
                due_date = task["due_date"]
                if isinstance(due_date, date):
                    task_record["due_date"] = due_date.isoformat()
                else:
                    task_record["due_date"] = due_date
                
            task_records.append(task_record)
        
        # Insert tasks in batch
        response = supabase.table("tasks").insert(task_records).execute()
        
        if response.data:
            return response.data
        raise Exception("Failed to create tasks")
    except Exception as e:
        print(f"Error in create_tasks_batch: {e}")
        raise e

async def get_tasks_for_user(user_id: UUID) -> List[Dict[str, Any]]:
    """Get all tasks for a specific user"""
    try:
        response = supabase.table("tasks").select(
            "id, description, due_date, status, created_at, note_id, is_important, user_id"
        ).eq("user_id", str(user_id)).order("created_at", desc=True).execute()
        
        return response.data
    except Exception as e:
        print(f"Error in get_tasks_for_user: {e}")
        raise e

async def update_task_status_by_id(task_id: UUID, user_id: UUID, status: str) -> Dict[str, Any]:
    """Update the status of a specific task"""
    try:
        # Ensure the task belongs to the user before updating
        response = supabase.table("tasks").update(
            {"status": status}
        ).eq("id", str(task_id)).eq("user_id", str(user_id)).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise Exception(f"Failed to update task status or task not found for ID: {task_id}")
    except Exception as e:
        print(f"Error in update_task_status_by_id: {e}")
        raise e

async def get_tasks_by_note_id(user_id: UUID, note_id: UUID) -> List[Dict[str, Any]]:
    """Get all tasks for a specific note and user"""
    try:
        response = supabase.table("tasks").select(
            "id, description, due_date, status, created_at, note_id, is_important, user_id"
        ).eq("user_id", str(user_id)).eq("note_id", str(note_id)).order("created_at", desc=True).execute()
        
        return response.data
    except Exception as e:
        print(f"Error in get_tasks_by_note_id: {e}")
        raise e

async def get_notes_with_tasks(user_id: UUID) -> List[Dict[str, Any]]:
    """Get all notes that have tasks for a specific user"""
    try:
        # First get all unique note_ids from tasks
        tasks_response = supabase.table("tasks").select(
            "note_id"
        ).eq("user_id", str(user_id)).execute()
        
        note_ids = list(set(task["note_id"] for task in tasks_response.data))
        
        if not note_ids:
            return []
            
        # Then get the notes details
        notes_response = supabase.table("meeting_notes").select(
            "id, original_text, summary, created_at"
        ).eq("user_id", str(user_id)).in_("id", note_ids).order("created_at", desc=True).execute()
        
        return notes_response.data
    except Exception as e:
        print(f"Error in get_notes_with_tasks: {e}")
        raise e

async def get_task_by_id_and_user(task_id: UUID, user_id: UUID) -> Dict[str, Any]:
    """Get a specific task by ID and user ID"""
    try:
        response = supabase.table("tasks").select(
            "id, description, due_date, status, created_at, note_id"
        ).eq("id", str(task_id)).eq("user_id", str(user_id)).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error in get_task_by_id_and_user: {e}")
        raise e

async def update_task_importance(task_id: UUID, user_id: UUID, is_important: bool) -> Optional[Dict[str, Any]]:
    """
    Update the importance of a task.
    """
    try:
        response = await supabase.table("tasks") \
            .update({"is_important": is_important}) \
            .eq("id", str(task_id)) \
            .eq("user_id", str(user_id)) \
            .execute()
        
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error in update_task_importance: {e}")
        raise

async def get_daily_digest_tasks(user_id: UUID) -> List[Dict[str, Any]]:
    """
    Get a smart digest of tasks for the user, prioritizing:
    1. Important tasks
    2. Tasks due today
    3. Tasks due this week
    4. Recently created tasks
    """
    try:
        today = datetime.now().date()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        # Get all tasks for the user
        response = supabase.table("tasks") \
            .select("id, description, status, is_important, created_at, due_date, note_id, user_id") \
            .eq("user_id", str(user_id)) \
            .order("is_important", desc=True) \
            .order("due_date", desc=False) \
            .order("created_at", desc=False) \
            .execute()

        if not response.data:
            return []

        tasks = response.data

        # Filter and sort tasks
        important_tasks = [t for t in tasks if t.get("is_important")]
        due_today = [t for t in tasks if t.get("due_date") and datetime.fromisoformat(t["due_date"]).date() == today]
        due_this_week = [t for t in tasks if t.get("due_date") and week_start <= datetime.fromisoformat(t["due_date"]).date() <= week_end]
        recent_tasks = [t for t in tasks if t not in important_tasks + due_today + due_this_week]

        # Combine all tasks in priority order
        digest_tasks = important_tasks + due_today + due_this_week + recent_tasks

        return digest_tasks
    except Exception as e:
        print(f"Error in get_daily_digest_tasks: {e}")
        raise