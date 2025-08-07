from server import create_app, AgentRequest

class AgentConfig:
  trae_agent_source: str = "/app/trae-agent-source"

  workspace: str = "/.workspace"

  trajectory_root: str = "/.trajectory"


  def parseCommand(self, request: AgentRequest, task_id: str) -> str:
    """Parse agent request to cli command"""
    return f'cd {trae_agent_source} && uv run trae-cli run "{request.task}" --working-dir {self.workspace}/{task_id} --trajectory-file {self.trajectory_root}/{task_id}.json'

  def getTrajectory(self, task_id: str) -> str:
    """Get trajectory of agent request"""
    # read trajectory from file
    trajectory = "Empty"
    with open(f'/app/trae-agent/.trajectory/{task_id}.json', 'r') as f:
      trajectory = f.read()
    return trajectory


if __name__ == "__main__":
    create_app(AgentConfig())
