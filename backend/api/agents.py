from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from agents.orchestrator import WorkflowOrchestrator
from backend.schemas.agent import AgentQuery, AgentQueryResponse
from backend.api import deps

router = APIRouter()
orchestrator = WorkflowOrchestrator()

@router.post("/query", response_model=AgentQueryResponse)
async def process_agent_query(
    data: AgentQuery,
    current_user: Any = Depends(deps.get_current_active_user)
) -> Any:
    """
    Process a natural language query through the multi-agent orchestrator.
    """
    try:
        response = await orchestrator.process_query(data.query, context=data.context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent processing error: {str(e)}"
        )
