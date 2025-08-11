import os
from server import create_app, AgentRequest
from dotenv import load_dotenv

load_dotenv()

class AgentConfig:
  # Get the directory of current file
  _current_dir = os.path.dirname(os.path.abspath(__file__))

  workspace: str = os.path.join(_current_dir, ".workspace")

  def parseCommand(self, request: AgentRequest, task_id: str) -> str:
    """Parse agent request to cli command"""

    prompt = f'# Task \n {request.task} \n'

    if request.error:
      prompt += f' # Error Context \n {request.error}'

    # mkdir {self.workspace}/{task_id}
    os.makedirs(f'{self.workspace}/{task_id}', exist_ok=True)

    # Escape double quotes in prompt to prevent shell parsing issues
    escaped_prompt = prompt.replace('"', '\\"')
    return f'cd {self.workspace}/{task_id} && qwen --yolo --prompt "{escaped_prompt}"'

  def getTrajectory(self, task_id: str, execute_res: dict) -> str:
    """Get trajectory of agent request"""
    return execute_res["stdout"] or "Empty"


if __name__ == "__main__":
  os.system(f'bash {AgentConfig._current_dir}/install.sh')
  print("✅ Install source success")
  os.system(f'bash {AgentConfig._current_dir}/cp_settings.sh')
  print("✅ Copy settings success")

  create_app(AgentConfig())
