from fastapi import APIRouter, HTTPException, Depends, status
from uuid import UUID
from typing import Dict, Any, List

from app.models.task_schemas import (
    TaskResponseSchema, 
    UpdateTaskStatusRequest,
    UpdateTaskImportanceRequest
)
from app.auth.security import get_current_user
from app.db.supabase_ops import (
    get_tasks_for_user, 
    update_task_status_by_id, 
    get_tasks_by_note_id, 
    get_notes_with_tasks,
    update_task_importance,
    get_daily_digest_tasks
)

router = APIRouter()

@router.get("", response_model=List[TaskResponseSchema])
async def get_user_tasks(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all tasks for the authenticated user.
    """
    try:
        user_id = UUID(current_user["user_id"])
        tasks = await get_tasks_for_user(user_id)
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving tasks: {str(e)}"
        )

@router.put("/{task_id}/status", response_model=TaskResponseSchema)
async def update_task_status(
    task_id: UUID,
    request: UpdateTaskStatusRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update the status of a specific task.
    """
    try:
        user_id = UUID(current_user["user_id"])
        updated_task = await update_task_status_by_id(task_id, user_id, request.status)
        return updated_task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task status: {str(e)}"
        )

@router.put("/{task_id}/importance", response_model=TaskResponseSchema)
async def update_task_importance(
    task_id: UUID,
    request: UpdateTaskImportanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update the importance of a specific task.
    """
    try:
        user_id = UUID(current_user["user_id"])
        updated_task = await update_task_importance(task_id, user_id, request.is_important)
        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return updated_task
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task importance: {str(e)}"
        )

@router.get("/daily-digest", response_model=List[TaskResponseSchema])
async def get_daily_digest(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get the daily smart digest of tasks for the authenticated user.
    """
    try:
        user_id = UUID(current_user["user_id"])
        digest_tasks = await get_daily_digest_tasks(user_id)
        return digest_tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving daily digest: {str(e)}"
        )

@router.get("/by-note/{note_id}", response_model=List[TaskResponseSchema])
async def get_tasks_by_note(
    note_id: UUID,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all tasks for a specific note for the authenticated user.
    """
    try:
        user_id = UUID(current_user["user_id"])
        tasks = await get_tasks_by_note_id(user_id, note_id)
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving tasks: {str(e)}"
        )

@router.get("/notes", response_model=List[Dict[str, Any]])
async def get_notes_with_tasks_endpoint(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all notes that have tasks for the authenticated user.
    """
    try:
        user_id = UUID(current_user["user_id"])
        notes = await get_notes_with_tasks(user_id)
        return notes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving notes with tasks: {str(e)}"
        )