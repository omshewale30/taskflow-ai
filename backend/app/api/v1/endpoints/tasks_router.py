from fastapi import APIRouter, HTTPException, Depends, status
from uuid import UUID
from typing import Dict, Any, List

from app.models.task_schemas import TaskResponseSchema, UpdateTaskStatusRequest
from app.auth.security import get_current_user
from app.db.supabase_ops import get_tasks_for_user, update_task_status_by_id

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