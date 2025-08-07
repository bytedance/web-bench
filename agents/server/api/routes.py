"""
API routing definition
Contains all FastAPI routing endpoints
"""

import logging
from fastapi import HTTPException, Depends
from fastapi.routing import APIRouter

from models.schemas import CLICommandRequest, CLICommandResponse, AgentRequest, AgentResponse
from models.config import AgentConfig
from services.command_service import CommandService
from services.agent_service import AgentService

logger = logging.getLogger(__name__)

# Create router instance
router = APIRouter()

# Initialize services
command_service = CommandService()


@router.post("/agent", response_model=AgentResponse)
async def run_agent(request: AgentRequest, config: AgentConfig = Depends(AgentConfig)):
  return await AgentService(config, command_service).run(request)
    """
    API endpoint for executing CLI commands
    
    Args:
        request: CLI command request
        
    Returns:
        Execution result
    """
    result = await command_service.execute_command(
        command=request.command,
        timeout=request.timeout,
        working_dir=request.working_dir
    )
    
    return CLICommandResponse(**result)

@router.get("/status/{execution_id}", response_model=CLICommandResponse)
async def get_execution_status(execution_id: str):
    """
    API endpoint for getting command execution status
    
    Args:
        execution_id: Execution ID
        
    Returns:
        Execution status
    """
    result = command_service.get_execution_status(execution_id)
    return CLICommandResponse(execution_id=execution_id, **result)


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return command_service.get_health_status()


@router.get("/stats")
async def get_stats():
    """Get service statistics"""
    return command_service.get_service_stats()


@router.delete("/clear")
async def clear_results():
    """Clear completed execution results"""
    return command_service.clear_completed_executions()