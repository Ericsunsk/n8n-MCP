/**
 * Project 相关 MCP 工具 (Enterprise)
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const CreateProjectSchema = z.object({
    name: z.string().describe('项目名称'),
});

export const UpdateProjectSchema = z.object({
    id: z.string().describe('项目 ID'),
    name: z.string().describe('新的项目名称'),
});

export const DeleteProjectSchema = z.object({
    id: z.string().describe('要删除的项目 ID'),
});

// 工具定义
export const projectTools = [
    {
        name: 'n8n_list_projects',
        description: '列出所有项目（需要企业版许可证）',
        inputSchema: {
            type: 'object' as const,
            properties: {},
        },
    },
    {
        name: 'n8n_create_project',
        description: '创建新项目（需要企业版许可证）',
        inputSchema: {
            type: 'object' as const,
            properties: {
                name: { type: 'string', description: '项目名称' },
            },
            required: ['name'],
        },
    },
    {
        name: 'n8n_update_project',
        description: '更新项目（需要企业版许可证）',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '项目 ID' },
                name: { type: 'string', description: '新的项目名称' },
            },
            required: ['id', 'name'],
        },
    },
    {
        name: 'n8n_delete_project',
        description: '删除项目（需要企业版许可证）',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的项目 ID' },
            },
            required: ['id'],
        },
    },
];

// 工具处理器
export async function handleProjectTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_projects': {
            return await client.listProjects();
        }
        case 'n8n_create_project': {
            const parsed = CreateProjectSchema.parse(args);
            return await client.createProject(parsed);
        }
        case 'n8n_update_project': {
            const parsed = UpdateProjectSchema.parse(args);
            return await client.updateProject(parsed.id, { name: parsed.name });
        }
        case 'n8n_delete_project': {
            const parsed = DeleteProjectSchema.parse(args);
            await client.deleteProject(parsed.id);
            return { success: true, message: `项目 ${parsed.id} 已删除` };
        }
        default:
            throw new Error(`Unknown project tool: ${toolName}`);
    }
}
