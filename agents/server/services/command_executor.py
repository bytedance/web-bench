"""
命令执行服务
负责CLI命令的实际执行逻辑
"""

import subprocess
import logging
from datetime import datetime
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class CommandExecutor:
    """命令执行器类"""
    
    @staticmethod
    def execute_command_sync(
        command: str, 
        timeout: int = 60, 
        working_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        同步执行CLI命令
        
        Args:
            command: 要执行的命令
            timeout: 超时时间（秒）
            working_dir: 工作目录
            
        Returns:
            包含执行结果的字典
        """
        start_time = datetime.now().isoformat()
        result = {
            "stdout": "",
            "stderr": "",
            "exit_code": None,
            "error": None,
            "start_time": start_time,
            "end_time": None
        }
        
        try:
            logger.info(f"开始执行命令: {command}")
            
            # 执行命令
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=working_dir
            )
            
            # 等待命令完成
            stdout, stderr = process.communicate(timeout=timeout)
            
            result["stdout"] = stdout
            result["stderr"] = stderr
            result["exit_code"] = process.returncode
            result["end_time"] = datetime.now().isoformat()
            
            logger.info(f"命令执行完成，退出码: {process.returncode}")
            
        except subprocess.TimeoutExpired:
            process.kill()
            process.communicate()
            result["error"] = f"命令执行超时（{timeout}秒）"
            result["exit_code"] = -1
            result["end_time"] = datetime.now().isoformat()
            logger.error(f"命令执行超时: {command}")
            
        except Exception as e:
            result["error"] = str(e)
            result["exit_code"] = -1
            result["end_time"] = datetime.now().isoformat()
            logger.error(f"命令执行失败: {command}, 错误: {str(e)}")
        
        return result