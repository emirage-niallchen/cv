export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('请求失败');
  }
  return response.json();
}; 