from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from uuid import UUID
from .task_schemas import ExtractedTaskSchema, TaskResponseSchema

# Note Processing Request Schema
class ProcessNoteRequest(BaseModel):
    text: str = Field(..., description="The text content of the meeting notes to process")

# Note Response Schema
class NoteBase(BaseModel):
    original_text: str
    summary: str

class NoteCreate(NoteBase):
    user_id: UUID

class NoteResponse(NoteBase):
    note_id: UUID
    extracted_tasks: List[ExtractedTaskSchema]
    created_at: Optional[str] = None

# Note Details Schema (including related tasks)
class NoteWithTasks(NoteBase):
    note_id: UUID
    created_at: str
    tasks: List[TaskResponseSchema]