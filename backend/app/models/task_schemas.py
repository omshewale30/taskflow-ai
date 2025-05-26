from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import date
from uuid import UUID

# Extracted Task Schema (from AI processing)
class ExtractedTaskSchema(BaseModel):
    description: str = Field(..., description="Clear description of the action item")
    due_date: Optional[date] = Field(None, description="Due date in YYYY-MM-DD format if mentioned")

class ExtractedTaskList(BaseModel):
    tasks: List[ExtractedTaskSchema]

# Task Creation Schema
class TaskCreateSchema(BaseModel):
    description: str
    due_date: Optional[date] = None

# Task Response Schema
class TaskResponseSchema(BaseModel):
    id: UUID
    description: str
    due_date: Optional[date] = None
    status: str  # "open" or "completed"
    created_at: str
    
    class Config:
        from_attributes = True

# Request Schema for saving tasks
class SaveTasksRequest(BaseModel):
    tasks: List[TaskCreateSchema]

# Request Schema for updating task status
class UpdateTaskStatusRequest(BaseModel):
    status: Literal["open", "completed"]