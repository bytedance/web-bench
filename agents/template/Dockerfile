FROM python:3.11-alpine

WORKDIR /app

COPY ../common /app

COPY ./parse.py /app

RUN uv sync

RUN source /app/venv/bin/activate

CMD ["python", "main.py"]



