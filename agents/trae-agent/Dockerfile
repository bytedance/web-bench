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

# install agent related logic
WORKDIR /app
RUN git clone https://github.com/bytedance/trae-agent.git trae-agent-source
RUN cd trae-agent
RUN uv sync

WORKDIR /app/agent
CMD ["uv", "run", "python", "-m", "trae_agent.main"]




