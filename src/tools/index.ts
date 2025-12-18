/**
 * 工具注册中心
 * 统一导出所有 MCP 工具定义和处理器
 */

import type { N8nClient } from '../n8n-client.js';
import { workflowTools, handleWorkflowTools } from './workflow-tools.js';
import { executionTools, handleExecutionTools } from './execution-tools.js';
import { credentialTools, handleCredentialTools } from './credential-tools.js';
import { userTools, handleUserTools } from './user-tools.js';
import { tagTools, handleTagTools } from './tag-tools.js';
import { variableTools, handleVariableTools } from './variable-tools.js';
import { projectTools, handleProjectTools } from './project-tools.js';
import { auditTools, handleAuditTools } from './audit-tools.js';

// 导出所有工具定义
export const allTools = [
    ...workflowTools,
    ...executionTools,
    ...credentialTools,
    ...userTools,
    ...tagTools,
    ...variableTools,
    ...projectTools,
    ...auditTools,
];

// 工具路由器
export async function handleToolCall(
    client: N8nClient,
    toolName: string,
    args: Record<string, unknown>
): Promise<unknown> {
    // Workflow 工具
    if (toolName.startsWith('n8n_') && (
        toolName.includes('workflow') ||
        toolName === 'n8n_execute_workflow'
    )) {
        return handleWorkflowTools(client, toolName, args);
    }

    // Execution 工具
    if (toolName.startsWith('n8n_') && toolName.includes('execution')) {
        return handleExecutionTools(client, toolName, args);
    }

    // Credential 工具
    if (toolName.startsWith('n8n_') && toolName.includes('credential')) {
        return handleCredentialTools(client, toolName, args);
    }

    // User 工具
    if (toolName.startsWith('n8n_') && toolName.includes('user')) {
        return handleUserTools(client, toolName, args);
    }

    // Tag 工具
    if (toolName.startsWith('n8n_') && toolName.includes('tag')) {
        return handleTagTools(client, toolName, args);
    }

    // Variable 工具
    if (toolName.startsWith('n8n_') && toolName.includes('variable')) {
        return handleVariableTools(client, toolName, args);
    }

    // Project 工具
    if (toolName.startsWith('n8n_') && toolName.includes('project')) {
        return handleProjectTools(client, toolName, args);
    }

    // Audit 工具
    if (toolName.startsWith('n8n_') && toolName.includes('audit')) {
        return handleAuditTools(client, toolName, args);
    }

    throw new Error(`Unknown tool: ${toolName}`);
}

// 导出各模块
export {
    workflowTools,
    executionTools,
    credentialTools,
    userTools,
    tagTools,
    variableTools,
    projectTools,
    auditTools,
};
