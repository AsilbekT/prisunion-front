export const setQueryParams = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(window.location.search);

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      searchParams.set(key, params[key]);
    }
  }

  const newUrl = window.location.pathname + '?' + searchParams.toString();
  window.history.pushState({ path: newUrl }, '', newUrl);
};
