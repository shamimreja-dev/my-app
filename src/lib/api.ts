
const BASE_URL = "https://api.api-store.workers.dev/api/bazardor";

export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

export type Category = {
  slug: string;
  nameBn: string;
  icon?: string;
  [key: string]: unknown;
};

async function fetchJSON<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts(): Promise<Product[]> {
  return fetchJSON<Product[]>("/products");
}

export function getProduct(slug: string): Promise<Product> {
  return fetchJSON<Product>(`/products/${encodeURIComponent(slug)}`);
}

export function getCategories(): Promise<Category[]> {
  return fetchJSON<Category[]>("/categories");
}

export function getProductsByCategory(
  category: string
): Promise<Product[]> {
  return fetchJSON<Product[]>(
    `/products?category=${encodeURIComponent(category)}`
  );
}
