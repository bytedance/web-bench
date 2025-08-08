FROM python:3.13-slim

# Install uv, uvx
COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/

# Install curl and tar, then download source code
RUN apt-get update && apt-get install -y curl tar

# Install Node.js & Npx For MCP
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

# Remove useless trash
RUN apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# install agent related logic
WORKDIR /app
COPY . .
RUN uv sync