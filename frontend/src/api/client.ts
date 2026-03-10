import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Token helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = "whattocook_access_token";
const REFRESH_KEY = "whattocook_refresh_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Request interceptor — attach JWT ───────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — handle 401 ──────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface JobResponse {
  job_id: string;
  upload_id: string;
  status: string;
}

export interface UploadDetailResponse {
  id: string;
  status: string;
  image_key: string;
  created_at: string;
  ingredients: IngredientResponse[];
  recipe_id: string | null;
}

export interface IngredientResponse {
  name: string;
  normalized_name: string;
  confidence: number;
}

export interface RecipeResponse {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  created_at: string;
  image_url: string | null;
}

export interface RecipeDetailResponse {
  id: string;
  title: string;
  description: string;
  ingredients_json: { name: string; amount: string; unit: string }[];
  instructions_json: { step: number; text: string }[];
  cuisine: string;
  difficulty: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  created_at: string;
  references: { relevance_score: number; snippet: string }[];
  images: { image_key: string; prompt_used: string; model_version: string }[];
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
  displayName?: string,
): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>("/auth/register", {
    email,
    password,
    display_name: displayName || null,
  });
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", {
    email,
    password,
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export function logout(): void {
  clearTokens();
}

// ─── Upload API ─────────────────────────────────────────────────────────────

export async function uploadFridgeImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<JobResponse> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post<JobResponse>("/uploads/fridge", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return data;
}

export async function getUpload(
  uploadId: string,
): Promise<UploadDetailResponse> {
  const { data } = await api.get<UploadDetailResponse>(
    `/uploads/${uploadId}`,
  );
  return data;
}

// ─── Recipe API ─────────────────────────────────────────────────────────────

export async function listRecipes(
  limit = 20,
  offset = 0,
): Promise<RecipeResponse[]> {
  const { data } = await api.get<RecipeResponse[]>("/recipes", {
    params: { limit, offset },
  });
  return data;
}

export async function getRecipe(
  recipeId: string,
): Promise<RecipeDetailResponse> {
  const { data } = await api.get<RecipeDetailResponse>(
    `/recipes/${recipeId}`,
  );
  return data;
}

// ─── Health ─────────────────────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await api.get<{ status: string }>("/health");
  return data;
}

export default api;
