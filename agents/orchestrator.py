from typing import Annotated, TypedDict, Union, List, Optional
from langgraph.graph import StateGraph, END
from backend.core.config import settings
from agents.base import AgentResponse
from security.guardrails import AIProtectionLayer, OutputVerificationAgent
from agents.eda_agent import EDAAgent
from agents.forecasting_agent import ForecastingAgent

class AgentState(TypedDict):
    """
    Represents the state of the agentic workflow.
    """
    query: str
    history: List[AgentResponse]
    next_agent: str
    final_response: Optional[str]
    is_safe: bool
    context: Optional[dict]

class WorkflowOrchestrator:
    """
    Orchestrates the multi-agent system using LangGraph-style logic.
    """
    
    def __init__(self):
        self.output_verifier = OutputVerificationAgent()
        self.eda_agent = EDAAgent()
        self.forecasting_agent = ForecastingAgent()
        self.builder = StateGraph(AgentState)
        self._setup_graph()

    def _setup_graph(self):
        # Define nodes
        self.builder.add_node("guardrail", self.run_guardrail)
        self.builder.add_node("eda_agent", self.run_eda)
        self.builder.add_node("forecasting_agent", self.run_forecasting)
        self.builder.add_node("verifier", self.run_verification)

        # Define edges
        self.builder.set_entry_point("guardrail")
        
        self.builder.add_conditional_edges(
            "guardrail",
            self.route_after_guardrail,
            {
                "blocked": END,
                "eda": "eda_agent",
                "forecast": "forecasting_agent"
            }
        )
        
        self.builder.add_edge("eda_agent", "verifier")
        self.builder.add_edge("forecasting_agent", "verifier")
        self.builder.add_edge("verifier", END)

        self.graph = self.builder.compile()

    async def run_guardrail(self, state: AgentState) -> dict:
        is_safe = not AIProtectionLayer.check_prompt_injection(state["query"])
        if not is_safe:
            return {
                "is_safe": False,
                "final_response": "[REDACTED: SECURITY VIOLATION]",
            }
        return {"is_safe": True}

    def route_after_guardrail(self, state: AgentState) -> str:
        if not state["is_safe"]:
            return "blocked"
        
        q = state["query"].lower()
        if any(w in q for w in ["profile", "eda", "analyze", "anomalies"]):
            return "eda"
        if any(w in q for w in ["forecast", "predict", "sales", "future"]):
            return "forecast"
        return "eda"

    async def run_eda(self, state: AgentState) -> dict:
        response = await self.eda_agent.execute(state["query"], context=state.get("context"))
        return {"final_response": response.content, "history": state.get("history", []) + [response]}

    async def run_forecasting(self, state: AgentState) -> dict:
        response = await self.forecasting_agent.execute(state["query"], context=state.get("context"))
        return {"final_response": response.content, "history": state.get("history", []) + [response]}

    async def run_verification(self, state: AgentState) -> dict:
        verification = self.output_verifier.verify(state["query"], state["final_response"])
        return {"final_response": verification["sanitized_response"]}

    async def process_query(self, query: str, context: Optional[dict] = None) -> str:
        initial_state = {
            "query": query,
            "history": [],
            "next_agent": "",
            "final_response": None,
            "is_safe": True,
            "context": context
        }
        result = await self.graph.ainvoke(initial_state)
        return result["final_response"]
