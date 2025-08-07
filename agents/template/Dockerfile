FROM python:3.11-alpine

WORKDIR /app

COPY ../ .

COPY start.sh .

RUN chmod +x start.sh

RUN uv sync

RUN source /app/venv/bin/activate

WORKDIR /app/agent

CMD ["./start.sh"]



