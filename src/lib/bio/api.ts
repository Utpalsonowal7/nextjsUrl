import axios from "axios";
import api from "@/api/axios";
import type { BioDraft, BioPage, Domain, Envelope } from "./types";
export const bioApi = {
  list: async () => (await api.get<Envelope<BioPage[]>>("/bio-pages")).data.data,
  get: async (id: string) => (await api.get<Envelope<BioPage>>(`/bio-pages/${id}`)).data.data,
  create: async (body: BioDraft) => (await api.post<Envelope<BioPage>>("/bio-pages", body)).data.data,
  update: async (id: string | number, body: Partial<BioDraft>) => (await api.patch<Envelope<BioPage>>(`/bio-pages/${id}`, body)).data.data,
  remove: async (id: number) => api.delete(`/bio-pages/${id}`),
};
export const domainApi = {
  list: async () => (await api.get<Envelope<{ domains: { domainFormat: Domain[] } }>>("/domain")).data.data.domains.domainFormat,
  create: async (domain: string) => (await api.post<Envelope<Domain>>("/domain", { domain })).data.data,
  verify: async (id: number) => (await api.post<Envelope<Domain>>(`/domain/${id}/verify`)).data.data,
  remove: async (id: number) => api.delete(`/domain/${id}`),
};
export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError<{ message?: string; errors?: string[] }>(error)) {
    return error.response?.data.errors?.join(" · ") || error.response?.data.message || fallback;
  }
  return fallback;
}
