"""
Data model definitions
Contains all Pydantic model definitions
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict

class AgentRequest(BaseModel):
    """Agent request model"""
    type: str = Field(..., description="Request type, e.g., normal")
    files: Dict[str, str] = Field(..., description="Mapping of file paths to content")
    task: str = Field(..., description="LLM thinking task description")
    error: Optional[str] = Field(None, description="Error context information")



class AgentResponse(BaseModel):
    """Agent response model"""
    taskId: str = Field(..., description="Task ID")
    files: Dict[str, str] = Field(..., description="Mapping of file paths to content")
    trajectory: str = Field(..., description="LLM thinking trajectory")
    stdout: str = Field(..., description="Standard output")
    stderr: str = Field(..., description="Standard error")
    exit_code: int = Field(..., description="Exit code")
    error: Optional[str] = Field(None, description="Error message if any")
    end_time: str = Field(..., description="End time")
    start_time: str = Field(..., description="Start time")