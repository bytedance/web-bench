import os
from server import create_app, AgentRequest

class AgentConfig:
  # Get the directory of current file
  _current_dir = os.path.dirname(os.path.abspath(__file__))
  
  # trae_agent_source: str = "/app/trae-agent-source"
  # workspace: str = "/.workspace"
  # trajectory_root: str = "/.trajectory"

  # Debug locally
  trae_agent_source: str = os.path.join(_current_dir, "trae-agent-source")
  workspace: str = os.path.join(_current_dir, "..", ".workspace")
  trajectory_root: str = os.path.join(_current_dir, "..", ".trajectory")

  def parseCommand(self, request: AgentRequest, task_id: str) -> str:
    """Parse agent request to cli command"""

    prompt = f'# Task \n {request.task} \n'
    prompt += f' # Constraint \n do not execute any generated code, just write & modify code \n'
    if request.error:
      prompt += f' # Error Response From Playwright \n {request.error}'

    return f'cd {self.trae_agent_source} && uv run trae-cli run "{prompt}" --working-dir {self.workspace}/{task_id} --trajectory-file {self.trajectory_root}/{task_id}.json'

  def getTrajectory(self, task_id: str) -> str:
    """Get trajectory of agent request"""
    # read trajectory from file
    trajectory = "Empty"
    try:
      with open(f'{self.trajectory_root}/{task_id}.json', 'r', encoding='utf-8') as f:
        trajectory = f.read()
    except FileNotFoundError:
      trajectory = f"Trajectory file not found for task {task_id}"
    except UnicodeDecodeError:
      trajectory = "Error: Unable to decode trajectory file as UTF-8"
    return trajectory


if __name__ == "__main__":
    create_app(AgentConfig())
