/**
 * Variable 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const CreateVariableSchema = z.object({
    key: z.string().describe('变量名'),
    value: z.string().describe('变量值'),
});

export const UpdateVariableSchema = z.object({
    id: z.string().describe('变量 ID'),
    key: z.string().describe('变量名'),
    value: z.string().describe('变量值'),
});

export const DeleteVariableSchema = z.object({
    id: z.string().describe('要删除的变量 ID'),
});

// 工具定义
export const variableTools = [
    {
        name: 'n8n_list_variables',
        description: '列出所有变量',
        inputSchema: {
            type: 'object' as const,
            properties: {},
        },
    },
    {
        name: 'n8n_create_variable',
        description: '创建新变量',
        inputSchema: {
            type: 'object' as const,
            properties: {
                key: { type: 'string', description: '变量名' },
                value: { type: 'string', description: '变量值' },
            },
            required: ['key', 'value'],
        },
    },
    {
        name: 'n8n_update_variable',
        description: '更新变量',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '变量 ID' },
                key: { type: 'string', description: '变量名' },
                value: { type: 'string', description: '变量值' },
            },
            required: ['id', 'key', 'value'],
        },
    },
    {
        name: 'n8n_delete_variable',
        description: '删除变量',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的变量 ID' },
            },
            required: ['id'],
        },
    },
];

// 工具处理器
export async function handleVariableTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_variables': {
            return await client.listVariables();
        }
        case 'n8n_create_variable': {
            const parsed = CreateVariableSchema.parse(args);
            return await client.createVariable(parsed);
        }
        case 'n8n_update_variable': {
            const parsed = UpdateVariableSchema.parse(args);
            return await client.updateVariable(parsed.id, { key: parsed.key, value: parsed.value });
        }
        case 'n8n_delete_variable': {
            const parsed = DeleteVariableSchema.parse(args);
            await client.deleteVariable(parsed.id);
            return { success: true, message: `变量 ${parsed.id} 已删除` };
        }
        default:
            throw new Error(`Unknown variable tool: ${toolName}`);
    }
}
