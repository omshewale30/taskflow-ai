from supabase import create_client, Client
from uuid import UUID
from typing import List, Dict, Any, Optional
from datetime import date
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
            "id:note_id, original_text, summary, created_at"
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
                "status": "open"  # Default status
            }
            
            # Add due_date if provided
            if "due_date" in task and task["due_date"]:
                task_record["due_date"] = task["due_date"]
                
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
            "id, description, due_date, status, created_at, note_id"
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