from pydantic import BaseModel
from typing import Optional, Dict, Any

class AgentQuery(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class AgentQueryResponse(BaseModel):
    response: str
    metadata: Optional[Dict[str, Any]] = None
