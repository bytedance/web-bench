# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:22-bookworm

WORKDIR /app

# Configure PNPM storage path only (remove RUSH_TEMP_FOLDER)
ENV RUSH_PNPM_STORE_PATH=/tmp/rush-pnpm-store

# Create necessary directories and ensure permissions
RUN mkdir -p ${RUSH_PNPM_STORE_PATH} && \
    chmod -R 777 /tmp

COPY . .

# Install specified version tools
RUN npm install -g npm@11.3.0 && \
    npm i -g pnpm@9.12.0 @microsoft/rush@5.140.0

# Clean up possible old files before rush update
RUN rm -rf common/temp/*

RUN npm i playwright@1.53.1 -g

# install chromium only
RUN npx playwright install --with-deps --only-shell chromium

# Update dependencies
RUN rush update

RUN rush build


CMD ["rush", "eval"]