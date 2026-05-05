const sanitizeInput = (req, res, next) => {
  const dangerousKeys = ['$', 'function', 'eval', 'constructor', 'prototype', '__proto__'];
  
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    for (let key in obj) {
      if (dangerousKeys.some(dk => key.includes(dk) || (typeof obj[key] === 'string' && obj[key].includes(dk)))) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/[\$\{\}\(\)\[\]\;\|\&\<\>]/g, '');
      }
    }
    return obj;
  };
  
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};

const rateLimit = new Map();

const rateLimiter = (limit = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, []);
    }
    
    const requests = rateLimit.get(ip).filter(time => time > windowStart);
    
    if (requests.length >= limit) {
      return res.status(429).json({ error: 'Too many requests, please try again later' });
    }
    
    requests.push(now);
    rateLimit.set(ip, requests);
    next();
  };
};

module.exports = { sanitizeInput, rateLimiter };