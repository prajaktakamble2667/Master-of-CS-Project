import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthUser, Session, Doctor, AdminStats, AdminReport } from './generated/api.schemas';

const API_BASE = '/api';

async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw { status: res.status, data };
  }
  return res.json();
}

// Auth
export const getGetMeQueryKey = () => ['auth', 'me'];
export const useGetMe = (options?: any) => 
  useQuery<AuthUser>({ queryKey: getGetMeQueryKey(), queryFn: () => fetcher('/auth/me'), ...options?.query });

export const useLogin = () => 
  useMutation<{role: string}, any, {data: any}>({ mutationFn: ({ data }) => fetcher('/auth/login', { method: 'POST', body: JSON.stringify(data) }) });

export const useRegister = () => 
  useMutation<{role: string}, any, {data: any}>({ mutationFn: ({ data }) => fetcher('/auth/register', { method: 'POST', body: JSON.stringify(data) }) });

export const useLogout = () => 
  useMutation({ mutationFn: () => fetcher('/auth/logout', { method: 'POST' }) });

// Chatbot
export const useAnalyzeHealthData = () => 
  useMutation<any, any, {data: any}>({ mutationFn: ({ data }) => fetcher('/chatbot/analyze', { method: 'POST', body: JSON.stringify(data) }) });

export const useCreateSession = () => 
  useMutation<{id: number}, any, {data: any}>({ mutationFn: ({ data }) => fetcher('/chatbot/sessions', { method: 'POST', body: JSON.stringify(data) }) });

export const getListSessionsQueryKey = () => ['chatbot', 'sessions'];
export const useListSessions = (options?: any) => 
  useQuery<Session[]>({ queryKey: getListSessionsQueryKey(), queryFn: () => fetcher('/chatbot/sessions'), ...options?.query });

export const getGetSessionQueryKey = (id: number) => ['chatbot', 'session', id];
export const useGetSession = (id: number, options?: any) => 
  useQuery<Session>({ queryKey: getGetSessionQueryKey(id), queryFn: () => fetcher(`/chatbot/sessions/${id}`), ...options?.query });

export const getGetDoctorsQueryKey = (params: any) => ['chatbot', 'doctors', params];
export const useGetDoctors = (params: { severity: string }, options?: any) => 
  useQuery<Doctor[]>({ queryKey: getGetDoctorsQueryKey(params), queryFn: () => fetcher(`/chatbot/doctors?severity=${params.severity}`), ...options?.query });

// Admin
export const useGetAdminStats = (options?: any) => 
  useQuery<AdminStats>({ queryKey: ['admin', 'stats'], queryFn: () => fetcher('/admin/stats'), ...options?.query });

export const getGetAdminReportsQueryKey = (params: any) => ['admin', 'reports', params];
export const useGetAdminReports = (params: { severity?: string }, options?: any) => {
  const queryStr = params.severity ? `?severity=${params.severity}` : '';
  return useQuery<AdminReport[]>({ queryKey: getGetAdminReportsQueryKey(params), queryFn: () => fetcher(`/admin/reports${queryStr}`), ...options?.query });
};
