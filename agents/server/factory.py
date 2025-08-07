"""
Application factory module
Responsible for creating and configuring FastAPI application
"""
import uvicorn
import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .services import CommandService, AgentService
from .utils.config import LOG_LEVEL, API_PORT
from .models import AgentConfig, AgentRequest, AgentResponse

def create_app(config: AgentConfig) -> FastAPI:
    """
    Create and configure FastAPI application
    
    Returns:
        Configured FastAPI application instance
    """
    # Configure logging
    logging.basicConfig(level=getattr(logging, LOG_LEVEL))
    logger = logging.getLogger(__name__)

    # Initialize services
    command_service = CommandService()
    agent_service = AgentService(config, command_service)
    
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

    @app.post("/agent", response_model=AgentResponse)
    async def run_agent(request: AgentRequest, config: AgentConfig = Depends(AgentConfig)):
        return await agent_service.run(request)

    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return command_service.get_health_status()

    @app.get("/stats")
    async def get_stats():
        """Get service statistics"""
        return command_service.get_service_stats()
    

    uvicorn.run(app, host="0.0.0.0", port=API_PORT)
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
    
    return 