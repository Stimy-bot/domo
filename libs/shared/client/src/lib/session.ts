import { API } from '@domo/config';

const getSessions = () => API.get('/sessions');

const deleteSession = (id: string) => API.delete(`/sessions/${id}`);

export default { getSessions, deleteSession };
