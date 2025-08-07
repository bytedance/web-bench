FROM python:3.13-slim
COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/

# Install Node.js & Npx For MCP
# RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /app/agent
COPY ../ .
RUN uv sync

# TODO install agent related logic


# TODO modify template.main to your own agent entry point
CMD ["uv", "run", "python", "-m", "template.main"]




