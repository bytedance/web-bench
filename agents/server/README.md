# CLI Execution Service

Refactored CLI execution service with modular architecture design.

## Project Structure

```
agents/server/
├── api/                    # API routing layer
│   ├── __init__.py
│   └── routes.py          # FastAPI route definitions
├── models/                 # Data model layer
│   ├── __init__.py
│   └── schemas.py         # Pydantic model definitions
├── services/               # Business logic layer
│   ├── __init__.py
│   ├── command_executor.py  # Command execution service
│   └── execution_manager.py # Execution manager
├── utils/                  # Utility modules
│   ├── __init__.py
│   └── config.py          # Configuration management
├── app_factory.py          # Application factory
├── main.py                # Application entry point
├── requirements.txt       # Dependencies list (compatible with traditional pip installation)
├── pyproject.toml         # uv project configuration (recommended)
```

## Usage Instructions

### Install Dependencies
Use uv for dependency management:
```bash
uv sync
```

### Start Service
```bash
uv run python main.py
```

Or run directly with uv:
```bash
uv run fastapi dev main.py --reload
```

### API Endpoints

- `POST /execute` - Execute CLI commands
- `GET /status/{execution_id}` - Query execution status
- `GET /health` - Health check
- `GET /stats` - Statistics
- `DELETE /clear` - Clear completed records

## Architecture Features

1. **Modular Design** - Code organized by function with clear responsibilities
2. **Scalability** - Easy to add new features or modify existing ones
3. **Testability** - Individual modules can be tested independently
4. **Configuration Management** - Centralized management of configuration parameters
5. **Error Handling** - Comprehensive exception handling mechanism