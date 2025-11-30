self.onmessage = function (e) {
  const { query, keys } = e.data;

  if (!query) {
    postMessage(keys);
    return;
  }

  const terms = query.toLowerCase().split(" ");

  const filtered = keys.filter(key => {

    return terms.every(t => {
      const isNegated = t.startsWith("!");
      const term = isNegated ? t.slice(1) : t;

      return isNegated ? !key.includes(term) : key.includes(term);
    });
  });

  postMessage(filtered);
};