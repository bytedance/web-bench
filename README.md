# Web-Bench

<p align="center">
    <a href="./README.zh_CN.md">中文</a> •
    <a href="#-installation">Install</a> •
    <a href="https://arxiv.org/abs/2505.07473">Paper</a> •
    <a href="https://huggingface.co/datasets/bytedance-research/Web-Bench">Datasets</a> •
    <a href="https://huggingface.co/spaces/bytedance-research/Web-Bench-Leaderboard">LeaderBoard</a> •
    <a href="#-citation">Citation</a>
</p>

## 📖 Overview

**Web-Bench** is a benchmark designed to evaluate the performance of LLMs in actual Web development. Web-Bench contains 50 projects, each consisting of 20 tasks with sequential dependencies. The tasks implement project features in sequence, simulating real-world human development workflows. When designing Web-Bench, we aim to cover the foundational elements of Web development: Web Standards and Web Frameworks. Given the scale and complexity of these projects, which were designed by engineers with 5-10 years of experience, each presents a significant challenge. On average, a single project takes 4–8 hours for a senior engineer to complete. On our given benchmark agent (Web-Agent), SOTA (Claude 3.7 Sonnet) achieves only 25.1\% Pass@1.

The distribution of the experimental data aligns well with the current code generation capabilities of mainstream LLMs.

<img width="500" alt="pass@1" src="./docs/assets/pass-1.png" />

HumanEval and MBPP have approached saturation. APPS and EvalPlus are approaching saturation. The SOTA for Web-Bench is 25.1\%, which is lower (better) than that of the SWE-bench Full and Verified sets.

<img width="500" alt="SOTAs" src="./docs/assets/sotas.png" />


## 🚀 Installation

1. [Install Node.js 22+](https://nodejs.org/en/download)
2. Init
```bash
git clone https://github.com/bytedance/Web-Bench.git
cd Web-Bench
npm i -g pnpm@9.12.0 @microsoft/rush@5.140.0 playwright@1.49.1
cd projects/angular &&  npx playwright install
rush update
rush build
```

If you wish to use Docker, refer to [Docker Guide](https://github.com/bytedance/web-bench/wiki/Docker).

## **📘** Usage

Complete [Configuration](https://github.com/bytedance/web-bench/wiki/Config) and run:

```bash
rush eval
```

## **🛠️** Contribution

* [Project Contribution](https://github.com/bytedance/web-bench/wiki/Project-Contribution)


## **📚** Citation

```bibtex
@article{xu2025webbench,
  title={Web-Bench: A LLM Code Benchmark Based on Web Standards and Frameworks},
  author={Xu, Kai and Mao, YiWei and Guan, XinYi and Feng, ZiLong},
  journal={arXiv preprint arXiv:2505.07473},
  year={2025}
}
```

## **📄** License

[Apache 2.0](./LICENSE.md) 
