"""
命令服务层
处理命令执行的业务逻辑，包括并发控制和错误处理
"""

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from fastapi import HTTPException
from typing import Dict, Any

from .command_executor import CommandExecutor
from .execution_manager import ExecutionManager
from ..utils.config import MAX_WORKERS

logger = logging.getLogger(__name__)


class CommandService:
    """命令服务类，封装命令执行的业务逻辑"""
    
    def __init__(self):
        self.execution_manager = ExecutionManager()
        self.executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
    
    async def execute_command(
        self, 
        command: str, 
        timeout: int = 60, 
        working_dir: str = None
    ) -> Dict[str, Any]:
        """
        执行CLI命令的完整业务逻辑
        
        Args:
            command: 要执行的命令
            timeout: 超时时间（秒）
            working_dir: 工作目录
            
        Returns:
            包含执行结果的字典
            
        Raises:
            HTTPException: 当线程池已满或执行失败时
        """
        execution_id = self.execution_manager.create_execution(command)
        
        try:
            # 检查线程池是否已满
            if len(self.execution_manager.get_all_executions()) > MAX_WORKERS:
                self.execution_manager.remove_execution(execution_id)
                raise HTTPException(
                    status_code=429,
                    detail=f"线程池已满，当前最大并发数为 {MAX_WORKERS}"
                )
            
            # 在线程池中执行命令
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor,
                CommandExecutor.execute_command_sync,
                command,
                timeout,
                working_dir
            )
            
            # 更新执行结果
            self.execution_manager.update_execution(execution_id, result)
            
            # 返回格式化的结果
            return {
                "execution_id": execution_id,
                "status": "completed",
                "command": command,
                "stdout": result["stdout"],
                "stderr": result["stderr"],
                "exit_code": result["exit_code"],
                "start_time": result["start_time"],
                "end_time": result["end_time"],
                "error": result["error"]
            }
            
        except HTTPException:
            raise
        except Exception as e:
            # 清理失败的执行记录
            self.execution_manager.remove_execution(execution_id)
            logger.error(f"命令执行失败: {command}, 错误: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_execution_status(self, execution_id: str) -> Dict[str, Any]:
        """
        获取命令执行状态
        
        Args:
            execution_id: 执行ID
            
        Returns:
            执行状态信息
            
        Raises:
            HTTPException: 当执行ID不存在时
        """
        result = self.execution_manager.get_execution(execution_id)
        if not result:
            raise HTTPException(status_code=404, detail="执行ID不存在")
        
        return result
    
    def get_service_stats(self) -> Dict[str, Any]:
        """获取服务统计信息"""
        return self.execution_manager.get_stats()
    
    def clear_completed_executions(self) -> Dict[str, Any]:
        """清除已完成的执行记录"""
        cleared_count = self.execution_manager.clear_completed()
        return {
            "message": f"已清除 {cleared_count} 个已完成的执行记录",
            "active_executions": len(self.execution_manager.get_all_executions())
        }
    
    def get_health_status(self) -> Dict[str, Any]:
        """获取健康检查信息"""
        return {
            "status": "healthy",
            "timestamp": asyncio.get_event_loop().time(),
            "active_executions": len(self.execution_manager.get_all_executions()),
            "max_workers": MAX_WORKERS
        }