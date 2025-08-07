"""
API路由定义
包含所有FastAPI路由端点
"""

import logging
from fastapi import HTTPException
from fastapi.routing import APIRouter

from models.schemas import CLICommandRequest, CLICommandResponse
from services.command_service import CommandService

logger = logging.getLogger(__name__)

# 创建路由实例
router = APIRouter()

# 初始化服务
command_service = CommandService()


@router.post("/execute", response_model=CLICommandResponse)
async def execute_command(request: CLICommandRequest):
    """
    执行CLI命令的API端点
    
    Args:
        request: CLI命令请求
        
    Returns:
        执行结果
    """
    result = await command_service.execute_command(
        command=request.command,
        timeout=request.timeout,
        working_dir=request.working_dir
    )
    
    return CLICommandResponse(**result)


@router.get("/status/{execution_id}", response_model=CLICommandResponse)
async def get_execution_status(execution_id: str):
    """
    获取命令执行状态的API端点
    
    Args:
        execution_id: 执行ID
        
    Returns:
        执行状态
    """
    result = command_service.get_execution_status(execution_id)
    return CLICommandResponse(execution_id=execution_id, **result)


@router.get("/health")
async def health_check():
    """健康检查端点"""
    return command_service.get_health_status()


@router.get("/stats")
async def get_stats():
    """获取服务统计信息"""
    return command_service.get_service_stats()


@router.delete("/clear")
async def clear_results():
    """清除已完成的执行结果"""
    return command_service.clear_completed_executions()