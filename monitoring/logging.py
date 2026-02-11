import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logging():
    """
    Sets up JSON structured logging for production observability.
    """
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    logHandler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)

    # Prevent logs from other libraries being too noisy
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)

    return logger

logger = setup_logging()
