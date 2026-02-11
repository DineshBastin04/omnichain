from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class AgentResponse(BaseModel):
    agent_name: str
    content: str
    metadata: Dict[str, Any] = {}
    confidence_score: float = 1.0

class BaseAgent:
    """
    Base class for all intelligence agents in the platform.
    """
    
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    async def execute(self, task: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        """
        Executes the agent's logic for a given task.
        To be implemented by subclasses.
        """
        raise NotImplementedError("Subclasses must implement execute()")

    def get_allowed_tools(self) -> List[str]:
        """Returns a list of tools this agent is allowed to use."""
        return []
