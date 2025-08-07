#!/usr/bin/env python3
"""
HTTP CLI执行服务 - 重构版
提供REST API接口来执行CLI命令，使用线程池管理并发
"""

import uvicorn

from app_factory import create_app
from utils.config import API_HOST, API_PORT


def main():
    """主函数"""
    app = create_app()
    
    print("🚀 启动CLI执行服务...")
    print("📋 可用端点:")
    print("  POST /execute - 执行CLI命令")
    print("  GET  /status/{execution_id} - 查询执行状态")
    print("  GET  /health - 健康检查")
    print("  GET  /stats - 统计信息")
    print("  DELETE /clear - 清除已完成的记录")
    print(f"⚙️  最大并发数: 10")
    print(f"🌐 服务启动在 http://localhost:{API_PORT}")
    
    uvicorn.run(
        app,
        host=API_HOST,
        port=API_PORT,
        log_level="info"
    )


if __name__ == "__main__":
    main()
