# n8n MCP Server

一个 MCP (Model Context Protocol) 服务器，让 AI 助手能够与 n8n 工作流自动化平台交互。

## 功能特性

| 模块 | 功能 |
|------|------|
| **Workflows** | 创建、更新、删除、激活、停用、执行工作流 |
| **Executions** | 查看、重试、删除执行记录 |
| **Credentials** | 列出、创建、删除凭证 |
| **Users** | 用户管理（列出/创建/删除/角色更新） |
| **Tags** | 标签管理 |
| **Variables** | 变量管理 |
| **Projects** | 项目管理（企业版） |
| **Audit** | 安全审计报告 |

## 安装

```bash
# 克隆仓库
git clone <repository-url>
cd n8n-MCP

# 安装依赖
npm install

# 构建
npm run build
```

## 配置

### 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `N8N_API_URL` | n8n 实例地址 | `http://localhost:5678` |
| `N8N_API_KEY` | n8n API 密钥 | 在 n8n 设置 > API 中创建 |

### 获取 API Key

1. 登录 n8n
2. 点击左下角用户图标 → Settings
3. 选择 API → Create API Key
4. 复制 API Key

## 使用

### Claude Desktop

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/n8n-MCP/build/index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor

编辑 `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/n8n-MCP/build/index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 可用工具

### Workflow 工具
- `n8n_list_workflows` - 列出所有工作流
- `n8n_get_workflow` - 获取工作流详情
- `n8n_create_workflow` - 创建工作流
- `n8n_update_workflow` - 更新工作流
- `n8n_delete_workflow` - 删除工作流
- `n8n_activate_workflow` - 激活工作流
- `n8n_deactivate_workflow` - 停用工作流
- `n8n_execute_workflow` - 执行工作流
- `n8n_update_workflow_tags` - 更新工作流标签

### Execution 工具
- `n8n_list_executions` - 列出执行记录
- `n8n_get_execution` - 获取执行详情
- `n8n_delete_execution` - 删除执行记录
- `n8n_retry_execution` - 重试执行

### 其他工具
- `n8n_list_credentials` / `create` / `delete` - 凭证管理
- `n8n_list_users` / `get` / `create` / `delete` / `update_role` - 用户管理
- `n8n_list_tags` / `get` / `create` / `update` / `delete` - 标签管理
- `n8n_list_variables` / `create` / `update` / `delete` - 变量管理
- `n8n_list_projects` / `create` / `update` / `delete` - 项目管理
- `n8n_generate_audit` - 安全审计

## 许可证

MIT
