/**
 * Tag 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const GetTagSchema = z.object({
    id: z.string().describe('标签 ID'),
});

export const CreateTagSchema = z.object({
    name: z.string().describe('标签名称'),
});

export const UpdateTagSchema = z.object({
    id: z.string().describe('标签 ID'),
    name: z.string().describe('新的标签名称'),
});

export const DeleteTagSchema = z.object({
    id: z.string().describe('要删除的标签 ID'),
});

// 工具定义
export const tagTools = [
    {
        name: 'n8n_list_tags',
        description: '列出所有标签',
        inputSchema: {
            type: 'object' as const,
            properties: {},
        },
    },
    {
        name: 'n8n_get_tag',
        description: '获取标签详情',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '标签 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_create_tag',
        description: '创建新标签',
        inputSchema: {
            type: 'object' as const,
            properties: {
                name: { type: 'string', description: '标签名称' },
            },
            required: ['name'],
        },
    },
    {
        name: 'n8n_update_tag',
        description: '更新标签',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '标签 ID' },
                name: { type: 'string', description: '新的标签名称' },
            },
            required: ['id', 'name'],
        },
    },
    {
        name: 'n8n_delete_tag',
        description: '删除标签',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的标签 ID' },
            },
            required: ['id'],
        },
    },
];

// 工具处理器
export async function handleTagTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_tags': {
            return await client.listTags();
        }
        case 'n8n_get_tag': {
            const parsed = GetTagSchema.parse(args);
            return await client.getTag(parsed.id);
        }
        case 'n8n_create_tag': {
            const parsed = CreateTagSchema.parse(args);
            return await client.createTag(parsed.name);
        }
        case 'n8n_update_tag': {
            const parsed = UpdateTagSchema.parse(args);
            return await client.updateTag(parsed.id, parsed.name);
        }
        case 'n8n_delete_tag': {
            const parsed = DeleteTagSchema.parse(args);
            await client.deleteTag(parsed.id);
            return { success: true, message: `标签 ${parsed.id} 已删除` };
        }
        default:
            throw new Error(`Unknown tag tool: ${toolName}`);
    }
}
