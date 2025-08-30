from .schemas import AgentRequest

class AgentConfig:
  workspace: str = ".workspace"

  def parseCommand(self, request: AgentRequest, task_id: str) -> str:
    """Parse agent request to cli command"""
    return "echo 'hello world' > res.txt"

  def getTrajectory(self, task_id: str) -> str:
    """Get trajectory of agent request"""
    return f'trajectory_test_{task_id}'
