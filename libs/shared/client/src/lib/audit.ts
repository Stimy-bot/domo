import { API } from '@domo/config';
import { auditLogListSchema, auditLogSchema, createAuditLogInputSchema } from '@domo/schemas';
import { normalizeAndValidateIp } from '@domo/utils';

const AUDIT_PATH = '/audit-logs';

/* Helpers */
function unwrapPayload(response: any) {
  return response?.data ?? response;
}

function ensureString(v: any): string {
  return typeof v === 'string' ? v : '';
}

function makePlaceholderId(i: number): string {
  return `missing-id-${i.toString().padStart(6, '0')}`;
}

function ensureEmail(email: any, fallbackBase = 'no-reply'): string {
  return typeof email === 'string' && email.includes('@') && !email.includes(' ')
    ? email
    : `${fallbackBase}+audit@example.com`;
}

function normalizeActor(raw: any, idx: number) {
  const id = ensureString(raw?._id ?? raw?.id);
  return {
    _id: id || makePlaceholderId(idx) + '-actor',
    email: ensureEmail(raw?.email ?? raw?.emailAddress, 'actor'),
    fullName: ensureString(raw?.fullName ?? raw?.name ?? ''),
  };
}

function normalizeTarget(raw: any, idx: number) {
  const id = ensureString(raw?._id ?? raw?.id);
  return {
    _id: id || makePlaceholderId(idx) + '-target',
    email: ensureEmail(raw?.email ?? raw?.emailAddress, 'target'),
    fullName: ensureString(raw?.fullName ?? raw?.name ?? ''),
  };
}

function normalizeMetadata(meta: any): Record<string, unknown> {
  return {
    ...meta,
    userAgent: meta?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
  };
}

/* API Methods */

export async function fetchAuditLogs(params?: Record<string, any>): Promise<unknown[]> {
  const response = await API.get(AUDIT_PATH, { params });
  const payload = unwrapPayload(response);
  try {
    return auditLogListSchema.parse(payload);
  } catch (err) {
    console.warn('fetchAuditLogs: auditLogListSchema parse failed', err);
    return Array.isArray(payload) ? payload : [];
  }
}

export async function getAuditLogById(id: string) {
  const response = await API.get(`${AUDIT_PATH}/${id}`);
  const payload = unwrapPayload(response);
  return auditLogSchema.parse(payload);
}

export async function createAuditLog(input: any) {
  const idx = 0;

  // Use 'ip' to stay consistent with the server-side schema
  const ip = normalizeAndValidateIp(input?.ip ?? input?.ipAddress ?? input?.metadata?.ipAddress);

  const normalized = {
    type: ensureString(input?.type),
    actor: normalizeActor(input?.actor, idx),
    target: input?.target ? normalizeTarget(input?.target, idx) : undefined,
    ip,
    metadata: normalizeMetadata(input?.metadata ?? {}),
  };

  const validInput = createAuditLogInputSchema.parse(normalized);
  const response = await API.post(AUDIT_PATH, validInput);
  const payload = unwrapPayload(response);
  return auditLogSchema.parse(payload);
}

export async function deleteAuditLogById(id: string) {
  const response = await API.delete(`${AUDIT_PATH}/${id}`);
  return unwrapPayload(response);
}

export async function deleteAuditLogs(params?: {
  type?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
  confirm?: boolean;
}) {
  const response = await API.delete(AUDIT_PATH, { params });
  return unwrapPayload(response);
}
