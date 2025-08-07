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
│   ├── command_service.py   # 命令业务逻辑服务（新增）
│   └── execution_manager.py # 执行管理器
├── utils/                  # 工具模块
│   ├── __init__.py
│   └── config.py          # 配置管理
├── app_factory.py          # 应用工厂
├── main.py                # 应用入口
└── requirements.txt       # 依赖列表
```

## 架构改进

### 服务层抽象 ✅
- **CommandService** 类封装了所有业务逻辑
- API路由现在只负责接收请求和返回响应
- 业务逻辑与API层完全解耦
- 支持更易于单元测试

## 职责分离
- **API层** (`api/routes.py`): 处理HTTP请求/响应
- **服务层** (`services/command_service.py`): 处理业务逻辑
- **执行层** (`services/command_executor.py`): 实际命令执行
- **管理层** (`services/execution_manager.py`): 状态管理

## 使用说明

### 安装依赖
```bash
pip install -r requirements.txt
```

### 启动服务
```bash
python main.py
```

### API端点

- `POST /execute` - 执行CLI命令
- `GET /status/{execution_id}` - 查询执行状态
- `GET /health` - 健康检查
- `GET /stats` - 统计信息
- `DELETE /clear` - 清除已完成的记录

## 架构特点

1. **模块化设计** - 代码按功能分层，职责清晰
2. **服务层抽象** - 业务逻辑集中在CommandService中
3. **可扩展性** - 易于添加新功能或修改现有功能
4. **可测试性** - 各个模块可以独立测试
5. **配置管理** - 集中管理配置参数
6. **错误处理** - 完善的异常处理机制