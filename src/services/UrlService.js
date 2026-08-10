export default class UrlService {
  constructor(urlRepository, redisClient, shortCodeStrategy) {
    this.urlRepository = urlRepository;
    this.redisClient = redisClient;
    this.shortCodeStrategy = shortCodeStrategy;
  }

  async shortenUrl(originalUrl) {
    const shortCode = this.shortCodeStrategy.generate();
    
    const urlData = {
      originalUrl,
      shortCode,
    };

    const savedUrl = await this.urlRepository.saveUrl(urlData);

    // Pre-warm the Redis cache (expires in 24 hours = 86400 seconds)
    try {
      if (this.redisClient && this.redisClient.isReady) {
        await this.redisClient.setEx(shortCode, 86400, originalUrl);
      }
    } catch (err) {
      console.error('Error setting cache:', err);
    }

    return savedUrl;
  }

  async resolveUrl(shortCode) {
    // 1. Check Redis cache first
    let originalUrl = null;
    
    try {
      if (this.redisClient && this.redisClient.isReady) {
        originalUrl = await this.redisClient.get(shortCode);
      }
    } catch (err) {
      console.error('Error getting from cache:', err);
    }

    if (originalUrl) {
      // Cache Hit: Async increment, non-blocking
      this.urlRepository.incrementClick(shortCode).catch((err) => {
        console.error('Error incrementing click count:', err);
      });
      return originalUrl;
    }

    // 2. Cache Miss: Query MongoDB
    const urlDoc = await this.urlRepository.findByCode(shortCode);
    if (!urlDoc) {
      return null;
    }

    originalUrl = urlDoc.originalUrl;

    // Update cache asynchronously
    try {
      if (this.redisClient && this.redisClient.isReady) {
        await this.redisClient.setEx(shortCode, 86400, originalUrl);
      }
    } catch (err) {
      console.error('Error updating cache:', err);
    }

    // Trigger async click increment
    this.urlRepository.incrementClick(shortCode).catch((err) => {
      console.error('Error incrementing click count:', err);
    });

    return originalUrl;
  }
}
