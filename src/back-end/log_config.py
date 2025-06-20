import logging
import sys


# Create a custom formatter that ensures 'correlation_id' is present.
class CustomFormatter(logging.Formatter):
    def format(self, record):
        # If 'correlation_id' is not set, add a default value.
        if not hasattr(record, "correlation_id"):
            record.correlation_id = "no-correlation-id"
        return super().format(record)


# Define the log format including the correlation_id.
log_format = "%(asctime)s - %(levelname)s - %(correlation_id)s - %(funcName)s - %(message)s"

# Create a stream handler that writes to sys.stdout.
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setFormatter(CustomFormatter(log_format))

# Get the logger and set its level.
logger = logging.getLogger("fastapi")
logger.setLevel(logging.INFO)
logger.addHandler(stream_handler)
# Prevent double logging if root logger is also configured.
logger.propagate = False
