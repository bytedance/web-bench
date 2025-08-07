"""
Data model definitions
Contains all Pydantic model definitions
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict


class CLICommandRequest(BaseModel):
    """CLI command request model"""
    command: str = Field(..., description="CLI command to execute")
    timeout: Optional[int] = Field(default=60, description="Command timeout in seconds")
    working_dir: Optional[str] = Field(default=None, description="Working directory for command execution")


class CLICommandResponse(BaseModel):
    """CLI command response model"""
    execution_id: str
    status: str
    command: str
    stdout: str = ""
    stderr: str = ""
    exit_code: Optional[int] = None
    start_time: str
    end_time: Optional[str] = None
    error: Optional[str] = None


class AgentRequest(BaseModel):
    """Agent request model"""
    type: str = Field(..., description="Request type, e.g., normal")
    files: Dict[str, str] = Field(..., description="Mapping of file paths to content")
    task: str = Field(..., description="LLM thinking task description")
    error: str = Field(..., description="Error context information")


class AgentResponse(BaseModel):
    """Agent response model"""
    files: Dict[str, str] = Field(..., description="Mapping of file paths to content")
    trajectory: str = Field(..., description="LLM thinking trajectory")