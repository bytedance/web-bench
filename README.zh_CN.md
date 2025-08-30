# Web-Bench

<p align="center">
    <a href="./README.md">English</a> •
    <a href="#-安装">安装</a> •
    <a href="https://arxiv.org/abs/2505.07473">论文</a> •
    <a href="https://huggingface.co/datasets/bytedance-research/Web-Bench">数据集</a> •
    <a href="https://huggingface.co/spaces/bytedance-research/Web-Bench-Leaderboard">排行榜</a> •
    <a href="#-引文">引文</a>
</p>

## **📖** 概要

**Web-Bench** 是一个用于评估 LLM 在真实 Web 项目上表现的基准。Web-Bench 包含 50 个项目，每个项目包含 20 个有时序依赖关系的任务，逼真模拟了人类开发项目的过程。Web-Bench 在设计时考虑了如何覆盖 Web 应用开发所依赖的基础：Web Standards 和 Web Frameworks。由于它们的庞大规模和复杂度，以及设计项目的工程师具备 5-10 年开发经验，最终设计出来的项目对于人类资深工程师而言都具有一定的复杂度（单项目平均 4-8 小时完成）。并且我们给定的基准 Agent 上，SOTA（Claude 3.7 Sonnet）Pass@1 仅有 25.1%。

实验数据的分布和当前主流 LLM 代码生成能力也较匹配。

<img width="500" alt="pass@1" src="./docs/assets/pass-1.png" />

HumanEval 和 MBPP 已趋于饱和，APPS 和 EvalPlus 也正在接近饱和状态。Web-Bench 的 SOTA 为 25.1%，低于 (低更好) SWE-bench Full 和 Verified。

<img width="500" alt="SOTAs" src="./docs/assets/sotas.png" />

## 🚀 快速上手

参考 [Docker 安装指南](https://docs.docker.com/engine/install/) 在您的机器上安装 Docker。

1. 创建一个新的空文件夹，在该文件夹中添加 **两个文件**：

```
./config.json5
./docker-compose.yml
```

2. 对于 `config.json5`，复制下面的 json 内容并根据 [配置参数](https://github.com/bytedance/web-bench/wiki/Config-Parameters) 进行编辑：

```json5
{
  models: [
    'openai/gpt-4o',
    // 你可以在这里添加更多模型
    // "claude-sonnet-4-20250514"
  ],
  // 只评测一个项目
  // "projects": ["@web-bench/react"]
}
```

3. 对于 `docker-compose.yml`，复制下面的 yaml 内容并 **设置环境**：

```yaml
services:
  web-bench:
    image: maoyiweiebay777/web-bench:latest
    volumes:
      - ./config.json5:/app/apps/eval/src/config.json5
      - ./report:/app/apps/eval/report
    environment:
      # 根据 apps/src/model.json 添加环境变量
      - OPENROUTER_API_KEY=your_api_key
      # 添加更多模型的密钥
      # - ANTHROPIC_API_KEY=your_api_key
```

4. 运行 docker-compose：

```bash
docker compose up
```

5. 评测报告将生成在 `./report/` 目录下。

如果你希望从源代码进行评测，请参阅[从源代码安装](https://github.com/bytedance/web-bench/wiki/Installation)。

## **🛠️** 贡献

- [项目贡献指南](https://github.com/bytedance/web-bench/wiki/Project-Contribution)

## **📚** 引文

```bibtex
@article{xu2025webbench,
  title={Web-Bench: A LLM Code Benchmark Based on Web Standards and Frameworks},
  author={Xu, Kai and Mao, YiWei and Guan, XinYi and Feng, ZiLong},
  journal={arXiv preprint arXiv:2505.07473},
  year={2025}
}
```

## **📄** 许可证

[Apache 2.0](./LICENSE.md)

## **🌟** 联系我们

- 飞书：扫描二维码 [注册飞书](https://www.feishu.cn/) 加入 Web Bench 用户群.

<img width="300" alt="pass@1" src="./docs/assets/lark-group-qr-code.png" />

- [Discord](https://discord.com/channels/1384111402653978645/1384111403098443838)
