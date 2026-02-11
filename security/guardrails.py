import re
from typing import List, Optional

class AIProtectionLayer:
    """
    Security layer for AI agents to prevent prompt injection and hallucinations.
    """
    
    # Simple heuristics for prompt injection detection
    INJECTION_PATTERNS = [
        r"(?i)ignore (all )?previous (instructions|directives)",
        r"(?i)system (role|prompt)",
        r"(?i)you are now a",
        r"(?i)bypass",
        r"(?i)reveal your (secret|hidden)",
        r"(?i)output (as|in) JSON (only|format)",
        r"(?i)sudo",
        r"(?i)execute"
    ]

    @classmethod
    def check_prompt_injection(cls, prompt: str) -> bool:
        """
        Returns True if a prompt injection attempt is detected.
        """
        for pattern in cls.INJECTION_PATTERNS:
            if re.search(pattern, prompt):
                return True
        return False

    @classmethod
    def sanitize_output(cls, output: str) -> str:
        """
        Basic sanitization for agent outputs to prevent PII leaks or harmful content.
        """
        # Placeholder for more complex logic
        # Could integrate with external systems like NeMo Guardrails
        return output.strip()

class OutputVerificationAgent:
    """
    Agent responsible for verifying the correctness and safety of other agents' outputs.
    """
    
    def __init__(self, confidence_threshold: float = 0.8):
        self.threshold = confidence_threshold

    def verify(self, query: str, response: str) -> dict:
        """
        Mock verification logic.
        """
        # In a real implementation, this would use another LLM call to verify
        # or check against ground truth data.
        
        is_safe = not AIProtectionLayer.check_prompt_injection(response)
        
        return {
            "is_verified": is_safe,
            "confidence_score": 0.95 if is_safe else 0.2,
            "sanitized_response": response if is_safe else "[REDACTED: SECURITY VIOLATION]"
        }
