# n8n-MCP Server

An implementation of the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) that enables AI agents to interact directly with **n8n** workflows.

## 🚀 Overview

This server provides a set of tools that allow AI assistants (like Claude, ChatGPT, or Antigravity) to:
- Trigger specific n8n workflows.
- Manage existing automations.
- Fetch workflow execution data.

## 🛠️ Features

- **Seamless Integration**: Connect your n8n workflows to any MCP-compatible AI client.
- **Secure**: Uses standard n8n API authentication.
- **Developer Friendly**: Built with TypeScript for type safety and easy extensibility.

## 📦 Installation

```bash
npm install
npm run build
```

## ⚙️ Configuration

Set the following environment variables:
- `N8N_API_URL`: Your n8n instance URL.
- `N8N_API_KEY`: Your n8n authentication token.

---
Created and maintained by [Ericsunsk](https://github.com/Ericsunsk)
