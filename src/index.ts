#!/usr/bin/env node
/**
 * n8n MCP Server
 * 允许 AI 助手通过 Model Context Protocol 与 n8n 交互
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { N8nClient } from './n8n-client.js';
import { allTools, handleToolCall } from './tools/index.js';

// ============================================================================
// 环境变量配置
// ============================================================================

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_URL || !N8N_API_KEY) {
    console.error('错误: 缺少必要的环境变量');
    console.error('请设置以下环境变量:');
    console.error('  N8N_API_URL - n8n 实例的 URL (例如: http://localhost:5678)');
    console.error('  N8N_API_KEY - n8n API 密钥');
    process.exit(1);
}

// ============================================================================
// 初始化
// ============================================================================

const n8nClient = new N8nClient({
    apiUrl: N8N_API_URL,
    apiKey: N8N_API_KEY,
});

const server = new Server(
    {
        name: 'n8n-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// ============================================================================
// 工具列表处理器
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: allTools,
    };
});

// ============================================================================
// 工具调用处理器
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        const result = await handleToolCall(
            n8nClient,
            name,
            (args as Record<string, unknown>) || {}
        );

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `错误: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

// ============================================================================
// 启动服务器
// ============================================================================

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('n8n MCP Server 已启动');
}

main().catch((error) => {
    console.error('服务器启动失败:', error);
    process.exit(1);
});
