from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from ics import Calendar, Event
from datetime import datetime, time, timedelta
from uuid import UUID
from typing import Dict, Any

from app.auth.security import get_current_user
from app.db.supabase_ops import get_task_by_id_and_user

router = APIRouter()

@router.get(
    "/tasks/{task_id}/calendar_event.ics",
    response_class=PlainTextResponse,
    tags=["Calendar"],
    summary="Generate .ics file for a task"
)
async def generate_task_calendar_event(
    task_id: UUID,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate an .ics calendar file for a task with a due date.
    The event will be created with a default duration of 1 hour starting at 9 AM
    if no specific time is provided.
    """
    try:
        # Get user_id from authenticated user
        user_id = UUID(current_user["user_id"])
        
        # Fetch task from database
        task = await get_task_by_id_and_user(task_id, user_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or does not belong to current user"
            )
        
        if not task.get("due_date"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task has no due date"
            )

        # Create calendar and event
        cal = Calendar()
        event = Event()

        # Set event name and description
        event.name = task.get("description", "Task Event")
        event_description = f"Task from TaskFlow AI: {task.get('description', '')}\n"
        if task.get("note_id"):
            event_description += f"Related to meeting notes ID: {task.get('note_id')}\n"
        event.description = event_description

        # Handle date and time
        due_date = datetime.fromisoformat(task["due_date"]).date()
        
        # Default to 9 AM start, 1 hour duration
        event.begin = datetime.combine(due_date, time(9, 0, 0))
        event.end = event.begin + timedelta(hours=1)

        # Add event to calendar
        cal.events.add(event)

        # Return the calendar as plain text
        return PlainTextResponse(str(cal), media_type="text/calendar")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating calendar event: {str(e)}"
        ) 