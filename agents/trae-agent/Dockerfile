FROM python:3.13-slim
COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/

# Install Node.js & Npx For MCP
# RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# install agent related logic
WORKDIR /app
# Install curl and tar, then download trae-agent source
RUN apt-get update && apt-get install -y curl tar \
    && curl -L https://github.com/bytedance/trae-agent/archive/refs/heads/main.tar.gz -o trae-agent.tar.gz \
    && tar -xzf trae-agent.tar.gz \
    && mv trae-agent-main trae-agent-source \
    && rm trae-agent.tar.gz \
    && apt-get remove -y curl \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN cd trae-agent-source && uv sync

# install trae-agent
WORKDIR /app/agent
COPY ../ .
RUN uv sync

CMD ["uv", "run", "python", "-m", "trae-agent.main"]




