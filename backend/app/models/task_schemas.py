from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import date, datetime
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
    is_important: Optional[bool] = False

# Task Response Schema
class TaskResponseSchema(BaseModel):
    id: UUID
    description: str
    status: str
    is_important: bool = False
    created_at: datetime
    due_date: Optional[date] = None
    note_id: Optional[UUID] = None
    user_id: UUID
    
    class Config:
        from_attributes = True

# Request Schema for saving tasks
class SaveTasksRequest(BaseModel):
    tasks: List[TaskCreateSchema]

# Request Schema for updating task status
class UpdateTaskStatusRequest(BaseModel):
    status: str = Field(..., description="New status of the task")

# Request Schema for updating task importance
class UpdateTaskImportanceRequest(BaseModel):
    is_important: bool = Field(..., description="Whether the task is important or not")