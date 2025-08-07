"""
执行管理器
负责管理命令执行状态和存储
"""

import uuid
import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)


class ExecutionManager:
    """执行管理器类"""
    
    def __init__(self):
        self.execution_results: Dict[str, Dict[str, Any]] = {}
    
    def create_execution(self, command: str) -> str:
        """创建新的执行记录"""
        execution_id = str(uuid.uuid4())
        self.execution_results[execution_id] = {
            "status": "running",
            "command": command,
            "start_time": datetime.now().isoformat()
        }
        return execution_id
    
    def update_execution(self, execution_id: str, result: Dict[str, Any]):
        """更新执行结果"""
        if execution_id in self.execution_results:
            self.execution_results[execution_id].update({
                "status": "completed",
                **result
            })
    
    def get_execution(self, execution_id: str) -> Dict[str, Any]:
        """获取执行记录"""
        return self.execution_results.get(execution_id)
    
    def get_all_executions(self) -> Dict[str, Dict[str, Any]]:
        """获取所有执行记录"""
        return self.execution_results.copy()
    
    def clear_completed(self) -> int:
        """清除已完成的执行记录"""
        running_tasks = {
            k: v for k, v in self.execution_results.items()
            if v.get("status") == "running"
        }
        cleared_count = len(self.execution_results) - len(running_tasks)
        self.execution_results = running_tasks
        return cleared_count
    
    def get_stats(self) -> Dict[str, Any]:
        """获取执行统计信息"""
        completed_count = sum(1 for r in self.execution_results.values() if r.get("status") == "completed")
        running_count = sum(1 for r in self.execution_results.values() if r.get("status") == "running")
        
        return {
            "total_executions": len(self.execution_results),
            "completed": completed_count,
            "running": running_count,
            "timestamp": datetime.now().isoformat()
        }
    
    def remove_execution(self, execution_id: str):
        """移除执行记录"""
        if execution_id in self.execution_results:
            del self.execution_results[execution_id]