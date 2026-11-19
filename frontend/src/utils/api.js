export async function apiFetch(
  url,
  options = {}
) {
  const token =
    localStorage.getItem("fraudlens_token");

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    url,
    {
      ...options,
      headers,
    }
  );

  // JWT invalid / expired
  if (response.status === 401) {
    localStorage.removeItem(
      "fraudlens_token"
    );

    localStorage.removeItem(
      "fraudlens_user"
    );

    window.location.href = "/login";

    return null;
  }

  return response;
}