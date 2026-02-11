from prometheus_client import Counter, Histogram, Summary
import time

# API Metrics
REQUEST_COUNT = Counter(
    'api_requests_total', 'Total API requests', ['method', 'endpoint', 'status_code']
)
REQUEST_LATENCY = Histogram(
    'api_request_latency_seconds', 'API request latency', ['endpoint']
)

# Agent Metrics
AGENT_EXECUTION_COUNT = Counter(
    'agent_executions_total', 'Total agent executions', ['agent_name', 'status']
)
AGENT_EXECUTION_TIME = Summary(
    'agent_execution_duration_seconds', 'Time spent in agent execution', ['agent_name']
)

def track_request_time(endpoint):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            response = await func(*args, **kwargs)
            REQUEST_LATENCY.labels(endpoint=endpoint).observe(time.time() - start_time)
            return response
        return wrapper
    return decorator
