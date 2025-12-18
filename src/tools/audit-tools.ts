/**
 * Audit 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const GenerateAuditSchema = z.object({
    categories: z.array(z.string()).optional().describe('要审计的类别（credentials, database, filesystem, nodes, instance）'),
});

// 工具定义
export const auditTools = [
    {
        name: 'n8n_generate_audit',
        description: '生成 n8n 实例的安全审计报告',
        inputSchema: {
            type: 'object' as const,
            properties: {
                categories: {
                    type: 'array',
                    items: { type: 'string' },
                    description: '要审计的类别（credentials, database, filesystem, nodes, instance）',
                },
            },
        },
    },
];

// 工具处理器
export async function handleAuditTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_generate_audit': {
            const parsed = GenerateAuditSchema.parse(args);
            return await client.generateAudit(parsed.categories);
        }
        default:
            throw new Error(`Unknown audit tool: ${toolName}`);
    }
}
