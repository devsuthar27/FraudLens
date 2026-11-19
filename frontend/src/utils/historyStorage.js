const STORAGE_KEY = "fraudlens_history";

export const getHistory = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addHistory = (type, input, result) => {
  const history = getHistory();

  history.unshift({
    type,
    input,
    score: result.score,
    status: result.status,
    reason: result.reason,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};