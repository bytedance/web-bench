from ..server import create_app

class AgentConfig:
  workspace: str = ".workspace"

  def parseCommand(self, request: AgentRequest) -> str:
    """Parse agent request to cli command"""
    return "echo 'hello template' > template.txt"

  def getTrajectory(self, task_id: str) -> str:
    """Get trajectory of agent request"""
    return f'template_trajectory_{task_id}'


if __name__ == "__main__":
    create_app(AgentConfig())
