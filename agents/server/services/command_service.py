"""
Command service layer
Handles command execution business logic including concurrency control and error handling
"""

import asyncio
import uuid
import subprocess
import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from fastapi import HTTPException
from typing import Dict, Any, Optional

from utils.config import MAX_WORKERS

logger = logging.getLogger(__name__)


class CommandService:
    """Command service class encapsulating command execution business logic"""
    
    def __init__(self):
        self._executions: Dict[str, Dict[str, Any]] = {}
        self._executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
    
    def _create_execution(self, command: str) -> str:
        """Create new execution record"""
        execution_id = str(uuid.uuid4())
        self._executions[execution_id] = {
            "status": "running",
            "command": command,
            "start_time": datetime.now().isoformat()
        }
        return execution_id
    
    def _get_execution(self, execution_id: str) -> Dict[str, Any]:
        """Get execution record"""
        return self._executions.get(execution_id)
    
    def _get_all_executions(self) -> Dict[str, Dict[str, Any]]:
        """Get all execution records"""
        return self._executions.copy()
    
    def _remove_execution(self, execution_id: str):
        """Remove execution record"""
        if execution_id in self._executions:
            del self._executions[execution_id]
    
    @staticmethod
    def _execute_command_sync(
        command: str, 
        timeout: int = 60, 
        working_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute CLI command synchronously"""
        start_time = datetime.now().isoformat()
        result = {
            "stdout": "",
            "stderr": "",
            "exit_code": None,
            "error": None,
            "start_time": start_time,
            "end_time": None
        }
        
        try:
            logger.info(f"Starting command execution: {command}")
            
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=working_dir
            )
            
            stdout, stderr = process.communicate(timeout=timeout)
            
            result.update({
                "stdout": stdout,
                "stderr": stderr,
                "exit_code": process.returncode,
                "end_time": datetime.now().isoformat()
            })
            
            logger.info(f"Command completed with exit code: {process.returncode}")
            
        except subprocess.TimeoutExpired:
            process.kill()
            process.communicate()
            result.update({
                "error": f"Command timeout ({timeout}s)",
                "exit_code": -1,
                "end_time": datetime.now().isoformat()
            })
            logger.error(f"Command timeout: {command}")
            
        except Exception as e:
            result.update({
                "error": str(e),
                "exit_code": -1,
                "end_time": datetime.now().isoformat()
            })
            logger.error(f"Command execution failed: {command}, error: {str(e)}")
        
        return result
    
    async def execute_command(
        self, 
        command: str, 
        timeout: int = 60, 
        working_dir: str = None
    ) -> Dict[str, Any]:
        """Execute CLI command with complete business logic"""
        execution_id = self._create_execution(command)
        
        try:
            if len(self._get_all_executions()) > MAX_WORKERS:
                self._remove_execution(execution_id)
                raise HTTPException(
                    status_code=429,
                    detail=f"Thread pool full, max concurrency: {MAX_WORKERS}"
                )
            
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self._executor,
                self._execute_command_sync,
                command,
                timeout,
                working_dir
            )
            
            self._remove_execution(execution_id)
            
            return {
                "execution_id": execution_id,
                "status": "completed",
                "command": command,
                **result
            }
            
        except HTTPException:
            raise
        except Exception as e:
            self._remove_execution(execution_id)
            logger.error(f"Command execution failed: {command}, error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_execution_status(self, execution_id: str) -> Dict[str, Any]:
        """Get command execution status"""
        result = self._get_execution(execution_id)
        if not result:
            raise HTTPException(status_code=404, detail="Execution ID not found")
        return result
    
    def get_service_stats(self) -> Dict[str, Any]:
        """Get service statistics"""
        completed = sum(1 for r in self._executions.values() if r.get("status") == "completed")
        running = sum(1 for r in self._executions.values() if r.get("status") == "running")
        
        return {
            "total_executions": len(self._executions),
            "completed": completed,
            "running": running,
            "timestamp": datetime.now().isoformat()
        }
    
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get health check information"""
        return {
            "status": "healthy",
            "timestamp": asyncio.get_event_loop().time(),
            "active_executions": len(self._get_all_executions()),
            "max_workers": MAX_WORKERS
        }
