from fastapi import APIRouter, HTTPException, Depends, status
from uuid import UUID
from typing import Dict, Any, List
import uuid

from app.models.note_schemas import ProcessNoteRequest, NoteResponse
from app.models.task_schemas import SaveTasksRequest, TaskResponseSchema
from app.auth.security import get_current_user
from app.services.ai_processing_service import generate_summary_and_extract_tasks
from app.db.supabase_ops import create_meeting_note, create_tasks_batch, get_meeting_note_by_id

router = APIRouter()

@router.post("/process", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def process_notes(
    request: ProcessNoteRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Process meeting notes to generate a summary and extract tasks.
    """
    try:
        # Get user_id from authenticated user
        user_id = UUID(current_user["user_id"])
        
        # Process notes with AI to generate summary and extract tasks
        summary, extracted_tasks = await generate_summary_and_extract_tasks(request.text)
        
        # Save the meeting note to database
        note_record = await create_meeting_note(user_id, request.text, summary)
        
        # Return the result
        return {
            "note_id": note_record["id"],
            "original_text": request.text,
            "summary": summary,
            "extracted_tasks": extracted_tasks,
            "created_at": note_record.get("created_at")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing notes: {str(e)}"
        )

@router.post("/{note_id}/tasks", response_model=List[TaskResponseSchema])
async def save_note_tasks(
    note_id: UUID,
    request: SaveTasksRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Save tasks extracted from a specific note.
    """
    try:
        # Get user_id from authenticated user
        user_id = UUID(current_user["user_id"])
        
        # Optional: Verify the user owns the note_id
        note = await get_meeting_note_by_id(note_id, user_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with ID {note_id} not found or does not belong to current user"
            )
        
        # Save tasks to database
        created_tasks = await create_tasks_batch(user_id, note_id, [task.dict() for task in request.tasks])
        
        return created_tasks
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving tasks: {str(e)}"
        )