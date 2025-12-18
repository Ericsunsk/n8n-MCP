/**
 * Credential 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const CreateCredentialSchema = z.object({
    name: z.string().describe('凭证名称'),
    type: z.string().describe('凭证类型'),
    data: z.record(z.any()).describe('凭证数据'),
});

export const DeleteCredentialSchema = z.object({
    id: z.string().describe('要删除的凭证 ID'),
});

// 工具定义
export const credentialTools = [
    {
        name: 'n8n_list_credentials',
        description: '列出所有凭证（不包含敏感数据）',
        inputSchema: {
            type: 'object' as const,
            properties: {},
        },
    },
    {
        name: 'n8n_create_credential',
        description: '创建新凭证',
        inputSchema: {
            type: 'object' as const,
            properties: {
                name: { type: 'string', description: '凭证名称' },
                type: { type: 'string', description: '凭证类型' },
                data: { type: 'object', description: '凭证数据' },
            },
            required: ['name', 'type', 'data'],
        },
    },
    {
        name: 'n8n_delete_credential',
        description: '删除凭证',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的凭证 ID' },
            },
            required: ['id'],
        },
    },
];

// 工具处理器
export async function handleCredentialTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_credentials': {
            return await client.listCredentials();
        }
        case 'n8n_create_credential': {
            const parsed = CreateCredentialSchema.parse(args);
            return await client.createCredential(parsed);
        }
        case 'n8n_delete_credential': {
            const parsed = DeleteCredentialSchema.parse(args);
            await client.deleteCredential(parsed.id);
            return { success: true, message: `凭证 ${parsed.id} 已删除` };
        }
        default:
            throw new Error(`Unknown credential tool: ${toolName}`);
    }
}
