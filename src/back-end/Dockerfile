FROM python:3.12
  
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
  
WORKDIR /home/app
COPY requirements.txt .
COPY ./main.py ./log_config.py ./auth.py ./
COPY db /home/app/db
COPY routes /home/app/routes

# 1. Install curl and uv
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh

# Ensure uv is on PATH
ENV PATH="/root/.local/bin:${PATH}"


# 2. Install Python deps globally (no venv)
RUN uv pip install --system --no-cache-dir -r requirements.txt

EXPOSE 8000

# 5. Launch via uv’s runner
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
