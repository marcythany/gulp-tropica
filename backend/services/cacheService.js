const cache = new Map();

const setCache = (key, value, ttl = 3600) => {
	const now = Date.now();
	const expireAt = now + ttl * 1000;
	cache.set(key, { value, expireAt });
	setTimeout(() => cache.delete(key), ttl * 1000);
};

const getCache = (key) => {
	const now = Date.now();
	const cached = cache.get(key);
	if (cached && cached.expireAt > now) {
		return cached.value;
	}
	cache.delete(key);
	return null;
};

export { setCache, getCache };
