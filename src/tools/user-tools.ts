/**
 * User 相关 MCP 工具
 */
import { z } from 'zod';
import type { N8nClient } from '../n8n-client.js';

// Zod Schemas
export const GetUserSchema = z.object({
    id: z.string().describe('用户 ID'),
});

export const CreateUserSchema = z.object({
    email: z.string().email().describe('用户邮箱'),
    firstName: z.string().optional().describe('名'),
    lastName: z.string().optional().describe('姓'),
    role: z.string().optional().describe('用户角色'),
});

export const DeleteUserSchema = z.object({
    id: z.string().describe('要删除的用户 ID'),
});

export const UpdateUserRoleSchema = z.object({
    id: z.string().describe('用户 ID'),
    role: z.string().describe('新的用户角色'),
});

// 工具定义
export const userTools = [
    {
        name: 'n8n_list_users',
        description: '列出所有用户',
        inputSchema: {
            type: 'object' as const,
            properties: {},
        },
    },
    {
        name: 'n8n_get_user',
        description: '获取用户详细信息',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '用户 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_create_user',
        description: '创建新用户',
        inputSchema: {
            type: 'object' as const,
            properties: {
                email: { type: 'string', description: '用户邮箱' },
                firstName: { type: 'string', description: '名' },
                lastName: { type: 'string', description: '姓' },
                role: { type: 'string', description: '用户角色' },
            },
            required: ['email'],
        },
    },
    {
        name: 'n8n_delete_user',
        description: '删除用户',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '要删除的用户 ID' },
            },
            required: ['id'],
        },
    },
    {
        name: 'n8n_update_user_role',
        description: '更新用户角色',
        inputSchema: {
            type: 'object' as const,
            properties: {
                id: { type: 'string', description: '用户 ID' },
                role: { type: 'string', description: '新的用户角色' },
            },
            required: ['id', 'role'],
        },
    },
];

// 工具处理器
export async function handleUserTools(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    switch (toolName) {
        case 'n8n_list_users': {
            return await client.listUsers();
        }
        case 'n8n_get_user': {
            const parsed = GetUserSchema.parse(args);
            return await client.getUser(parsed.id);
        }
        case 'n8n_create_user': {
            const parsed = CreateUserSchema.parse(args);
            return await client.createUser(parsed);
        }
        case 'n8n_delete_user': {
            const parsed = DeleteUserSchema.parse(args);
            await client.deleteUser(parsed.id);
            return { success: true, message: `用户 ${parsed.id} 已删除` };
        }
        case 'n8n_update_user_role': {
            const parsed = UpdateUserRoleSchema.parse(args);
            return await client.updateUserRole(parsed.id, parsed.role);
        }
        default:
            throw new Error(`Unknown user tool: ${toolName}`);
    }
}
