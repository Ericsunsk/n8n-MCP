/**
 * Workflow 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const ListWorkflowsSchema = z.object({
    active: z.boolean().optional().describe('按激活状态过滤'),
    tags: z.string().optional().describe('按标签ID过滤（逗号分隔）'),
    cursor: z.string().optional().describe('分页游标'),
    limit: z.number().optional().describe('返回数量限制'),
});

export const GetWorkflowSchema = z.object({
    id: z.string().describe('工作流 ID'),
});

export const CreateWorkflowSchema = z.object({
    name: z.string().describe('工作流名称'),
    nodes: z.array(z.any()).optional().describe('节点配置数组'),
    connections: z.record(z.any()).optional().describe('节点连接配置'),
    settings: z.record(z.any()).optional().describe('工作流设置'),
});

export const UpdateWorkflowSchema = z.object({
    id: z.string().describe('工作流 ID'),
    name: z.string().optional().describe('新的工作流名称'),
    nodes: z.array(z.any()).optional().describe('节点配置数组'),
    connections: z.record(z.any()).optional().describe('节点连接配置'),
    settings: z.record(z.any()).optional().describe('工作流设置'),
});

export const DeleteWorkflowSchema = z.object({
    id: z.string().describe('要删除的工作流 ID'),
});

export const ActivateWorkflowSchema = z.object({
    id: z.string().describe('要激活的工作流 ID'),
});

export const DeactivateWorkflowSchema = z.object({
    id: z.string().describe('要停用的工作流 ID'),
});

export const ExecuteWorkflowSchema = z.object({
    id: z.string().describe('要执行的工作流 ID（需要配置 Webhook 触发器）'),
    data: z.record(z.any()).optional().describe('传递给工作流的数据'),
});

export const UpdateWorkflowTagsSchema = z.object({
    id: z.string().describe('工作流 ID'),
    tagIds: z.array(z.string()).describe('标签 ID 数组'),
});

// 工具定义
export const workflowTools = [
    {
        name: 'n8n_list_workflows',
        description: '列出所有 n8n 工作流',
        inputSchema: {
            type: 'object' as const,
            properties: {
                active: { type: 'boolean', description: '按激活状态过滤' },
                tags: { type: 'string', description: '按标签ID过滤（逗号分隔）' },
                cursor: { type: 'string', description: '分页游标' },
                limit: { type: 'number', description: '返回数量限制' },
            },
        },
    },
    {
        name: 'n8n_get_workflow',
        description: '获取特定工作流的详细信息',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '工作流 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_create_workflow',
        description: '创建新的 n8n 工作流',
        inputSchema: {
            type: 'object' as const,
            properties: {
                name: { type: 'string', description: '工作流名称' },
                nodes: { type: 'array', description: '节点配置数组' },
                connections: { type: 'object', description: '节点连接配置' },
                settings: { type: 'object', description: '工作流设置' },
            },
            required: ['name'],
        },
    },
    {
        name: 'n8n_update_workflow',
        description: '更新现有的 n8n 工作流',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '工作流 ID' },
                name: { type: 'string', description: '新的工作流名称' },
                nodes: { type: 'array', description: '节点配置数组' },
                connections: { type: 'object', description: '节点连接配置' },
                settings: { type: 'object', description: '工作流设置' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_delete_workflow',
        description: '删除 n8n 工作流',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的工作流 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_activate_workflow',
        description: '激活 n8n 工作流',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要激活的工作流 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_deactivate_workflow',
        description: '停用 n8n 工作流',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要停用的工作流 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_execute_workflow',
        description: '执行 n8n 工作流（需要工作流配置 Webhook 触发器）',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要执行的工作流 ID' },
                data: { type: 'object', description: '传递给工作流的数据' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_update_workflow_tags',
        description: '更新工作流的标签',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '工作流 ID' },
                tagIds: { type: 'array', items: { type: 'string' }, description: '标签 ID 数组' },
            },
            required: ['id', 'tagIds'],
        },
    },
];

// 工具处理器
export async function handleWorkflowTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_workflows': {
            const parsed = ListWorkflowsSchema.parse(args);
            return await client.listWorkflows(parsed);
        }
        case 'n8n_get_workflow': {
            const parsed = GetWorkflowSchema.parse(args);
            return await client.getWorkflow(parsed.id);
        }
        case 'n8n_create_workflow': {
            const parsed = CreateWorkflowSchema.parse(args);
            return await client.createWorkflow(parsed);
        }
        case 'n8n_update_workflow': {
            const parsed = UpdateWorkflowSchema.parse(args);
            const { id, ...data } = parsed;
            return await client.updateWorkflow(id, data);
        }
        case 'n8n_delete_workflow': {
            const parsed = DeleteWorkflowSchema.parse(args);
            await client.deleteWorkflow(parsed.id);
            return { success: true, message: `工作流 ${parsed.id} 已删除` };
        }
        case 'n8n_activate_workflow': {
            const parsed = ActivateWorkflowSchema.parse(args);
            return await client.activateWorkflow(parsed.id);
        }
        case 'n8n_deactivate_workflow': {
            const parsed = DeactivateWorkflowSchema.parse(args);
            return await client.deactivateWorkflow(parsed.id);
        }
        case 'n8n_execute_workflow': {
            const parsed = ExecuteWorkflowSchema.parse(args);
            return await client.executeWorkflow(parsed.id, parsed.data);
        }
        case 'n8n_update_workflow_tags': {
            const parsed = UpdateWorkflowTagsSchema.parse(args);
            return await client.updateWorkflowTags(parsed.id, parsed.tagIds);
        }
        default:
            throw new Error(`Unknown workflow tool: ${toolName}`);
    }
}
