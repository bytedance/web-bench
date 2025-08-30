curl -L https://github.com/bytedance/trae-agent/archive/refs/heads/main.tar.gz -o trae-agent.tar.gz
tar -xzf trae-agent.tar.gz
mv trae-agent-main .source
rm trae-agent.tar.gz
cd .source && uv sync