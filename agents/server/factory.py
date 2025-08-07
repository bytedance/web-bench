"""
Application factory module
Responsible for creating and configuring FastAPI application
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from utils.config import LOG_LEVEL
from models.config import AgentConfig

def create_app(config: AgentConfig) -> FastAPI:
    """
    Create and configure FastAPI application
    
    Returns:
        Configured FastAPI application instance
    """
    # Configure logging
    logging.basicConfig(level=getattr(logging, LOG_LEVEL))
    logger = logging.getLogger(__name__)
    
    # Create FastAPI application
    app = FastAPI(
        title="CLI Execution Service",
        description="Execute CLI commands via HTTP interface",
        version="1.0.0"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register routes
    app.include_router(router, prefix="")

    # Print startup information
    print("🚀 Start Agent Server...")
    print("📋 Available endpoints:")
    print("  POST /execute - Execute CLI commands")
    print("  GET  /status/{execution_id} - Query execution status")
    print("  GET  /health - Health check")
    print("  GET  /stats - Statistics")
    print("  DELETE /clear - Clear completed records")
    print(f"⚙️ MAX Workers: 10")
    print(f"🌐 Service running at http://localhost:{API_PORT}")
    
    
    return app