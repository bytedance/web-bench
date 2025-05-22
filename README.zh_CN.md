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

## 🚀 安装


1. [安装 Node.js 22+](https://nodejs.org/en/download)
2. 初始化
```bash

1. [安装 Node.js 22+](https://nodejs.org/en/download)
2. 初始化
```bash
git clone https://github.com/bytedance/Web-Bench.git
cd Web-Bench
npm i -g pnpm@9.12.0 @microsoft/rush@5.140.0
rush update
rush build
```

如果想使用 Docker 环境，参考 [Docker 指南](https://github.com/bytedance/web-bench/wiki/Docker).

## **📘** 使用

完成[配置](https://github.com/bytedance/web-bench/wiki/Config)后执行： 

```bash
rush eval
```

## **🛠️** 贡献

* [项目贡献指南](https://github.com/bytedance/web-bench/wiki/Project-Contribution)


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
