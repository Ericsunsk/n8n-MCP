/**
 * Execution 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const ListExecutionsSchema = z.object({
    workflowId: z.string().optional().describe('按工作流 ID 过滤'),
    status: z.string().optional().describe('按状态过滤 (waiting, running, success, error)'),
    limit: z.number().optional().describe('返回结果数量限制'),
});

export const GetExecutionSchema = z.object({
    id: z.string().describe('执行记录 ID'),
});

export const DeleteExecutionSchema = z.object({
    id: z.string().describe('要删除的执行记录 ID'),
});

export const RetryExecutionSchema = z.object({
    id: z.string().describe('要重试的执行记录 ID'),
});

// 工具定义
export const executionTools = [
    {
        name: 'n8n_list_executions',
        description: '列出工作流执行记录',
        inputSchema: {
            type: 'object' as const,
            properties: {
                workflowId: { type: 'string', description: '按工作流 ID 过滤' },
                status: { type: 'string', description: '按状态过滤 (waiting, running, success, error)' },
                limit: { type: 'number', description: '返回结果数量限制' },
            },
        },
    },
    {
        name: 'n8n_get_execution',
        description: '获取特定执行记录的详细信息',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '执行记录 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_delete_execution',
        description: '删除执行记录',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的执行记录 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_retry_execution',
        description: '重试失败的执行',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要重试的执行记录 ID' },
            },
            required: ['id'],
        },
    },
];

// 工具处理器
export async function handleExecutionTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_executions': {
            const parsed = ListExecutionsSchema.parse(args);
            return await client.listExecutions(parsed);
        }
        case 'n8n_get_execution': {
            const parsed = GetExecutionSchema.parse(args);
            return await client.getExecution(parsed.id);
        }
        case 'n8n_delete_execution': {
            const parsed = DeleteExecutionSchema.parse(args);
            await client.deleteExecution(parsed.id);
            return { success: true, message: `执行记录 ${parsed.id} 已删除` };
        }
        case 'n8n_retry_execution': {
            const parsed = RetryExecutionSchema.parse(args);
            return await client.retryExecution(parsed.id);
        }
        default:
            throw new Error(`Unknown execution tool: ${toolName}`);
    }
}
