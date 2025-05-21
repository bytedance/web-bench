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

# 仅配置PNPM存储路径（移除RUSH_TEMP_FOLDER）
ENV RUSH_PNPM_STORE_PATH=/tmp/rush-pnpm-store

# 创建必要目录并确保权限
RUN mkdir -p ${RUSH_PNPM_STORE_PATH} && \
    chmod -R 777 /tmp

COPY . .

# 安装指定版本工具
RUN npm install -g npm@11.3.0 && \
    npm i -g pnpm@9.12.0 @microsoft/rush@5.140.0

# 在rush update前清理可能的旧文件
RUN rm -rf common/temp/*

RUN npm i playwright@1.49.1 -g

RUN npx playwright install

RUN playwright install-deps

# 更新依赖
RUN rush update

RUN rush build


CMD ["rush", "eval"]