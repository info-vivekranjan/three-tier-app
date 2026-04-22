const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6800/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return null;
    return JSON.parse(userInfo)?.token || null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["x-access-token"] = token;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  // 204 no content
  if (res.status === 204) return {} as T;
  return res.json();
}

// ---- Auth ----
export const login = (email: string, password: string) =>
  request<{ data: UserInfo }>("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (formData: FormData) =>
  request<UserInfo>("/user/register", { method: "POST", body: formData });

// ---- Notes ----
export const getNotes = (page = 1, limit = 6) =>
  request<NotesResponse>(`/note/getAllNotes?page=${page}&limit=${limit}`);

export const getNote = (id: string) =>
  request<{ data: Note }>(`/note/getSingleNote/${id}`);

export const createNote = (formData: FormData) =>
  request<{ data: Note }>("/note/createNote", { method: "POST", body: formData });

export const updateNote = (id: string, formData: FormData) =>
  request<{ data: Note }>(`/note/updateNote/${id}`, { method: "PUT", body: formData });

export const deleteNote = (id: string) =>
  request(`/note/deleteNote/${id}`, { method: "DELETE" });

// ---- Text Editor ----
export const getTextDocs = (page = 1, limit = 6) =>
  request<TextResponse>(`/textEditor/getAllTextData?page=${page}&limit=${limit}`);

export const getTextDoc = (id: string) =>
  request<{ data: TextDoc }>(`/textEditor/getSingleTextData/${id}`);

export const createTextDoc = (body: { title: string; category: string; content: string }) =>
  request<{ data: TextDoc }>("/textEditor/createTextData", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateTextDoc = (id: string, body: { title: string; category: string; content: string }) =>
  request<{ data: TextDoc }>(`/textEditor/updateTextData/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteTextDoc = (id: string) =>
  request(`/textEditor/deleteTextData/${id}`, { method: "DELETE" });

// ---- Markdown Editor ----
export const getMarkdownDocs = (page = 1, limit = 6) =>
  request<MarkdownResponse>(`/markdownEditor/getAllMarkdownData?page=${page}&limit=${limit}`);

export const getMarkdownDoc = (id: string) =>
  request<{ data: MarkdownDoc }>(`/markdownEditor/getSingleMarkdownData/${id}`);

export const createMarkdownDoc = (body: { title: string; category: string; content: string }) =>
  request<{ data: MarkdownDoc }>("/markdownEditor/createMarkdownData", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateMarkdownDoc = (id: string, body: { title: string; category: string; content: string }) =>
  request<{ data: MarkdownDoc }>(`/markdownEditor/updateMarkdownData/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteMarkdownDoc = (id: string) =>
  request(`/markdownEditor/deleteMarkdownData/${id}`, { method: "DELETE" });

// ---- Types ----
export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  pic?: string;
  token: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  anyfile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextDoc {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface MarkdownDoc {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface NotesResponse {
  data: Note[];
  count: number;
  totalPages: number;
  currentPage: number;
}
interface TextResponse {
  data: TextDoc[];
  count: number;
  totalPages: number;
  currentPage: number;
}
interface MarkdownResponse {
  data: MarkdownDoc[];
  count: number;
  totalPages: number;
  currentPage: number;
}
