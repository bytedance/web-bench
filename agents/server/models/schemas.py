"""
数据模型定义
包含所有Pydantic模型定义
"""

from pydantic import BaseModel, Field
from typing import Optional


class CLICommandRequest(BaseModel):
    """CLI命令请求模型"""
    command: str = Field(..., description="要执行的CLI命令")
    timeout: Optional[int] = Field(default=60, description="命令超时时间（秒）")
    working_dir: Optional[str] = Field(default=None, description="命令执行的工作目录")


class CLICommandResponse(BaseModel):
    """CLI命令响应模型"""
    execution_id: str
    status: str
    command: str
    stdout: str = ""
    stderr: str = ""
    exit_code: Optional[int] = None
    start_time: str
    end_time: Optional[str] = None
    error: Optional[str] = None