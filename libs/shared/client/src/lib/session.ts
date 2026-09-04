import { API } from '@domo/config';

export const getSessions = () => API.get('/sessions');

export const deleteSession = (id: string) =>
  API.delete(`/sessions/${id}`);