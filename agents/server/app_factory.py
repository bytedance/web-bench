"""
应用工厂模块
负责创建和配置FastAPI应用
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from utils.config import LOG_LEVEL

def create_app() -> FastAPI:
    """
    创建并配置FastAPI应用
    
    Returns:
        配置好的FastAPI应用实例
    """
    # 配置日志
    logging.basicConfig(level=getattr(logging, LOG_LEVEL))
    logger = logging.getLogger(__name__)
    
    # 创建FastAPI应用
    app = FastAPI(
        title="CLI执行服务",
        description="通过HTTP接口执行CLI命令",
        version="1.0.0"
    )
    
    # 添加CORS中间件
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # 注册路由
    app.include_router(router, prefix="")
    
    return app