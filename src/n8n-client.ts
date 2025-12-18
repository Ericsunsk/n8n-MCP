/**
 * n8n API 客户端
 * 封装与 n8n REST API v1 的所有交互
 */

// ============================================================================
// 类型定义
// ============================================================================

export interface N8nConfig {
    apiUrl: string;
    apiKey: string;
}

export interface Workflow {
    id: string;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    nodes?: unknown[];
    connections?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    staticData?: unknown;
    tags?: Tag[];
}

export interface Execution {
    id: string;
    finished: boolean;
    mode: string;
    retryOf?: string;
    retrySuccessId?: string;
    startedAt: string;
    stoppedAt?: string;
    workflowId: string;
    workflowData?: Workflow;
    data?: unknown;
    status: string;
}

export interface Credential {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Variable {
    id: string;
    key: string;
    value: string;
    type?: string;
}

export interface Project {
    id: string;
    name: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuditReport {
    risk: string;
    sections: unknown[];
}

export interface PaginatedResponse<T> {
    data: T[];
    nextCursor?: string;
}

// ============================================================================
// n8n API 客户端类
// ============================================================================

export class N8nClient {
    private readonly baseUrl: string;
    private readonly headers: Record<string, string>;

    constructor(config: N8nConfig) {
        // 移除末尾斜杠并添加 /api/v1
        this.baseUrl = config.apiUrl.replace(/\/+$/, '') + '/api/v1';
        this.headers = {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': config.apiKey,
        };
    }

    // --------------------------------------------------------------------------
    // 通用请求方法
    // --------------------------------------------------------------------------

    private async request<T>(
        method: string,
        endpoint: string,
        body?: unknown,
        queryParams?: Record<string, string>
    ): Promise<T> {
        let url = `${this.baseUrl}${endpoint}`;

        if (queryParams) {
            const params = new URLSearchParams(queryParams);
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method,
            headers: this.headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`n8n API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // 处理 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return response.json() as Promise<T>;
    }

    // --------------------------------------------------------------------------
    // Workflows API
    // --------------------------------------------------------------------------

    async listWorkflows(filters?: { active?: boolean; tags?: string; cursor?: string; limit?: number }): Promise<PaginatedResponse<Workflow>> {
        const params: Record<string, string> = {};
        if (filters?.active !== undefined) params.active = String(filters.active);
        if (filters?.tags) params.tags = filters.tags;
        if (filters?.cursor) params.cursor = filters.cursor;
        if (filters?.limit) params.limit = String(filters.limit);
        return this.request<PaginatedResponse<Workflow>>('GET', '/workflows', undefined, params);
    }

    async getWorkflow(id: string): Promise<Workflow> {
        return this.request<Workflow>('GET', `/workflows/${id}`);
    }

    async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
        return this.request<Workflow>('POST', '/workflows', workflow);
    }

    async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
        return this.request<Workflow>('PUT', `/workflows/${id}`, workflow);
    }

    async deleteWorkflow(id: string): Promise<void> {
        await this.request<void>('DELETE', `/workflows/${id}`);
    }

    async activateWorkflow(id: string): Promise<Workflow> {
        return this.request<Workflow>('POST', `/workflows/${id}/activate`);
    }

    async deactivateWorkflow(id: string): Promise<Workflow> {
        return this.request<Workflow>('POST', `/workflows/${id}/deactivate`);
    }

    async getWorkflowTags(id: string): Promise<Tag[]> {
        return this.request<Tag[]>('GET', `/workflows/${id}/tags`);
    }

    async updateWorkflowTags(id: string, tagIds: string[]): Promise<Tag[]> {
        return this.request<Tag[]>('PUT', `/workflows/${id}/tags`, tagIds.map(tagId => ({ id: tagId })));
    }

    // --------------------------------------------------------------------------
    // Executions API
    // --------------------------------------------------------------------------

    async listExecutions(filters?: {
        workflowId?: string;
        status?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Execution>> {
        const params: Record<string, string> = {};
        if (filters?.workflowId) params.workflowId = filters.workflowId;
        if (filters?.status) params.status = filters.status;
        if (filters?.limit) params.limit = String(filters.limit);
        return this.request<PaginatedResponse<Execution>>('GET', '/executions', undefined, params);
    }

    async getExecution(id: string): Promise<Execution> {
        return this.request<Execution>('GET', `/executions/${id}`);
    }

    async deleteExecution(id: string): Promise<void> {
        await this.request<void>('DELETE', `/executions/${id}`);
    }

    async retryExecution(id: string): Promise<Execution> {
        return this.request<Execution>('POST', `/executions/${id}/retry`);
    }

    // n8n webhook 执行工作流
    async executeWorkflow(id: string, data?: Record<string, unknown>): Promise<unknown> {
        // 通过 webhook 触发工作流
        const baseUrl = this.baseUrl.replace('/api/v1', '');
        const response = await fetch(`${baseUrl}/webhook/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`Webhook execution failed: ${response.status}`);
        }

        return response.json();
    }

    // --------------------------------------------------------------------------
    // Credentials API
    // --------------------------------------------------------------------------

    async listCredentials(): Promise<PaginatedResponse<Credential>> {
        return this.request<PaginatedResponse<Credential>>('GET', '/credentials');
    }

    async createCredential(credential: {
        name: string;
        type: string;
        data: Record<string, unknown>;
    }): Promise<Credential> {
        return this.request<Credential>('POST', '/credentials', credential);
    }

    async deleteCredential(id: string): Promise<void> {
        await this.request<void>('DELETE', `/credentials/${id}`);
    }

    // --------------------------------------------------------------------------
    // Users API
    // --------------------------------------------------------------------------

    async listUsers(): Promise<PaginatedResponse<User>> {
        return this.request<PaginatedResponse<User>>('GET', '/users');
    }

    async getUser(id: string): Promise<User> {
        return this.request<User>('GET', `/users/${id}`);
    }

    async createUser(user: {
        email: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }): Promise<User> {
        return this.request<User>('POST', '/users', user);
    }

    async deleteUser(id: string): Promise<void> {
        await this.request<void>('DELETE', `/users/${id}`);
    }

    async updateUserRole(id: string, role: string): Promise<User> {
        return this.request<User>('PATCH', `/users/${id}/role`, { newRoleName: role });
    }

    // --------------------------------------------------------------------------
    // Tags API
    // --------------------------------------------------------------------------

    async listTags(): Promise<PaginatedResponse<Tag>> {
        return this.request<PaginatedResponse<Tag>>('GET', '/tags');
    }

    async getTag(id: string): Promise<Tag> {
        return this.request<Tag>('GET', `/tags/${id}`);
    }

    async createTag(name: string): Promise<Tag> {
        return this.request<Tag>('POST', '/tags', { name });
    }

    async updateTag(id: string, name: string): Promise<Tag> {
        return this.request<Tag>('PUT', `/tags/${id}`, { name });
    }

    async deleteTag(id: string): Promise<void> {
        await this.request<void>('DELETE', `/tags/${id}`);
    }

    // --------------------------------------------------------------------------
    // Variables API
    // --------------------------------------------------------------------------

    async listVariables(): Promise<PaginatedResponse<Variable>> {
        return this.request<PaginatedResponse<Variable>>('GET', '/variables');
    }

    async createVariable(variable: { key: string; value: string }): Promise<Variable> {
        return this.request<Variable>('POST', '/variables', variable);
    }

    async updateVariable(id: string, variable: { key: string; value: string }): Promise<Variable> {
        return this.request<Variable>('PUT', `/variables/${id}`, variable);
    }

    async deleteVariable(id: string): Promise<void> {
        await this.request<void>('DELETE', `/variables/${id}`);
    }

    // --------------------------------------------------------------------------
    // Projects API (Enterprise)
    // --------------------------------------------------------------------------

    async listProjects(): Promise<PaginatedResponse<Project>> {
        return this.request<PaginatedResponse<Project>>('GET', '/projects');
    }

    async createProject(project: { name: string }): Promise<Project> {
        return this.request<Project>('POST', '/projects', project);
    }

    async updateProject(id: string, project: { name: string }): Promise<Project> {
        return this.request<Project>('PUT', `/projects/${id}`, project);
    }

    async deleteProject(id: string): Promise<void> {
        await this.request<void>('DELETE', `/projects/${id}`);
    }

    // --------------------------------------------------------------------------
    // Audit API
    // --------------------------------------------------------------------------

    async generateAudit(categories?: string[]): Promise<AuditReport> {
        const body = categories ? { additionalOptions: { categories } } : undefined;
        return this.request<AuditReport>('POST', '/audit', body);
    }
}
