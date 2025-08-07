# CLI执行服务

重构后的CLI执行服务，采用模块化架构设计。

## 项目结构

```
agents/server/
├── api/                    # API路由层
│   ├── __init__.py
│   └── routes.py          # FastAPI路由定义
├── models/                 # 数据模型层
│   ├── __init__.py
│   └── schemas.py         # Pydantic模型定义
├── services/               # 业务逻辑层
│   ├── __init__.py
│   ├── command_executor.py  # 命令执行服务
│   └── execution_manager.py # 执行管理器
├── utils/                  # 工具模块
│   ├── __init__.py
│   └── config.py          # 配置管理
├── app_factory.py          # 应用工厂
├── main.py                # 应用入口
├── requirements.txt       # 依赖列表（兼容传统pip安装）
├── pyproject.toml         # uv项目配置（推荐）
```

## 使用说明

### 安装依赖
使用 uv 进行依赖管理：
```bash
uv sync
```

### 启动服务
```bash
uv run python main.py
```

或者使用 uv 直接运行：
```bash
uv run fastapi dev main.py --reload
```

### API端点

- `POST /execute` - 执行CLI命令
- `GET /status/{execution_id}` - 查询执行状态
- `GET /health` - 健康检查
- `GET /stats` - 统计信息
- `DELETE /clear` - 清除已完成的记录

## 架构特点

1. **模块化设计** - 代码按功能分层，职责清晰
2. **可扩展性** - 易于添加新功能或修改现有功能
3. **可测试性** - 各个模块可以独立测试
4. **配置管理** - 集中管理配置参数
5. **错误处理** - 完善的异常处理机制