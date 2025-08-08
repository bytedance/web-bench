import os
import uuid
import datetime
import random
from typing import Dict

from ..models.config import AgentConfig
from ..models.schemas import AgentRequest, AgentResponse
from .command_service import CommandService

class AgentService:
  def __init__(self, config: AgentConfig, command_service: CommandService):
    self.config = config
    self.command_service = command_service

  def _write_files_to_workspace(self, workspace: str, files: Dict[str, str]) -> None:
    """Write file dictionary to specified workspace
    Creates necessary directory structure based on file paths
    
    Args:
        workspace: Target workspace directory path
        files: Dictionary mapping file paths to content
    """
    for file_path, file_content in files.items():
      # Ensure file path is safe
      safe_file_path = os.path.normpath(file_path)
      if safe_file_path.startswith('..'):
        continue  # Skip unsafe paths
        
      full_file_path = os.path.join(workspace, safe_file_path)
      
      # Ensure directory exists
      os.makedirs(os.path.dirname(full_file_path), exist_ok=True)
      
      # Write file content
      with open(full_file_path, 'w', encoding='utf-8') as f:
        f.write(file_content)


  def _read_files_in_workspace(self, workspace: str) -> Dict[str, str]:
    """Recursively read all file contents from workspace
    
    Args:
        workspace: Workspace directory path
        
    Returns:
        Dictionary mapping file paths to content
    """
    files = {}
    for root, _, filenames in os.walk(workspace):
      for filename in filenames:
        file_path = os.path.join(root, filename)
        relative_path = os.path.relpath(file_path, workspace)
        try:
          with open(file_path, 'r', encoding='utf-8') as f:
            files[relative_path] = f.read()
        except (UnicodeDecodeError, IOError):
          # Skip files that cannot be read as UTF-8 or have other read issues
          continue
    return files

  async def run(self, request: AgentRequest) -> AgentResponse:
    start_time = datetime.datetime.now().isoformat()

    # 0. Generate unique task ID (format: YYYYMMDD-HHMMSS-randomID)
    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d-%H%M%S")
    random_suffix = str(uuid.uuid4().hex[:6])
    taskId = f"{date_str}-{random_suffix}"

    # 1. Prepare workspace
    workspace = os.path.join(self.config.workspace, taskId)
    os.makedirs(workspace, exist_ok=True)
    
    # 1.2. Write files from request.files to taskId/ folder
    self._write_files_to_workspace(workspace, request.files)

    # 2. Execute command in workspace
    command = self.config.parseCommand(request, taskId)
    execute_res = await self.command_service.execute_command(command, working_dir=workspace)

    # 3. Copy execution results from workspace
    result_files = self._read_files_in_workspace(workspace)
    trajectory = self.config.getTrajectory(taskId, execute_res)

    return AgentResponse(
      taskId=taskId,
      files=result_files,
      trajectory=trajectory,
      stdout=execute_res["stdout"],
      stderr=execute_res["stderr"],
      exit_code=execute_res["exit_code"],
      error=execute_res["error"],
      end_time=execute_res["end_time"],
      start_time=start_time,
    )
