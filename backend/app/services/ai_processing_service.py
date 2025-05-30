from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda
from pydantic import BaseModel, Field
from typing import List, Optional, Tuple, Dict, Any
from datetime import date
import os
import json
from app.core.config import settings

# Define Pydantic models for structured output
class ExtractedTaskItem(BaseModel):
    description: str = Field(description="Clear description of the action item")
    due_date: Optional[date] = Field(None, description="Due date in YYYY-MM-DD format if mentioned, otherwise null")

class ExtractedTaskList(BaseModel):
    tasks: List[ExtractedTaskItem]

# Initialize the LLM
def get_llm():
    """Initialize and return the OpenAI LLM with environment settings"""
    return ChatOpenAI(
        model_name=settings.OPENAI_MODEL_NAME, 
        temperature=0.2,
        api_key=settings.OPENAI_API_KEY
    )

# Summarization chain
def create_summarization_chain():
    """Create a chain for summarizing meeting notes"""
    llm = get_llm()
    
    summarize_prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant that summarizes meeting notes concisely."),
        ("user", "Please summarize the following meeting notes:\n\n{notes_text}")
    ])
    
    summarization_chain = summarize_prompt_template | llm | StrOutputParser()
    return summarization_chain

# Task extraction chain
def create_task_extraction_chain():
    """Create a chain for extracting tasks from meeting notes"""
    llm = get_llm()
    
    # Task extraction prompt
    task_extraction_prompt_text = """
    Extract all distinct action items from the provided meeting notes. For each action item:
    1. Provide a clear and concise "description" of the task.
    2. If a specific "due_date" is mentioned, provide it in YYYY-MM-DD format. If no due date is explicitly mentioned, set due_date to null.

    Respond ONLY with a valid JSON object containing a single key "tasks", which is a list of these action items. If no action items are found, return an empty list for "tasks".

    Example:
    {{
      "tasks": [
        {{"description": "Send follow-up email to John Doe", "due_date": "2025-06-15"}},
        {{"description": "Prepare Q3 budget report", "due_date": null}}
      ]
    }}

    Meeting Notes:
    {notes_text}
    """
    
    task_extraction_prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert assistant skilled in extracting structured task information from text."),
        ("user", task_extraction_prompt_text)
    ])
    
    # Using JsonOutputParser
    output_parser = PydanticOutputParser(pydantic_object=ExtractedTaskList)
    task_extraction_chain = task_extraction_prompt_template | llm | output_parser
    
    return task_extraction_chain

def format_final_output(processed_output: Dict[str, Any]) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Format the final output of the task extraction chain.
    """
    summary = processed_output.get("summary", "Error generating summary.")
    extracted_tasks_list_obj: Optional[ExtractedTaskList] = processed_output.get("tasks")
    tasks_as_dict = []
    
    if extracted_tasks_list_obj and hasattr(extracted_tasks_list_obj, "tasks"):
        tasks_as_dict = [task.model_dump() for task in extracted_tasks_list_obj.tasks]
    
    return summary, tasks_as_dict

processing_pipeline = RunnableParallel(
    summary = create_summarization_chain(),
    tasks = create_task_extraction_chain()
)

agentic_workflow = processing_pipeline | RunnableLambda(format_final_output)

async def generate_summary_and_extract_tasks(text: str) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Process meeting notes to generate a summary and extract tasks.
    
    Args:
        text (str): The meeting notes text to process
        
    Returns:
        Tuple containing:
        - summary (str): A concise summary of the meeting notes
        - tasks (List[dict]): List of extracted tasks with description and optional due_date
    """
    try:
        # Initialize chains
        result = await agentic_workflow.ainvoke({"notes_text": text})
        return result[0], result[1]
    
    except Exception as e:
        print(f"Error in generate_summary_and_extract_tasks: {e}")
        # Return minimal results in case of error
        return "Error generating summary.", []