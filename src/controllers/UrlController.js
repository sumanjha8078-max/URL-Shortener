import UrlRepository from '../repositories/UrlRepository.js';
import redisClient from '../config/redis.js';
import NanoidStrategy from '../strategies/NanoidStrategy.js';
import UrlService from '../services/UrlService.js';

const nanoidStrategy = new NanoidStrategy();
const urlService = new UrlService(UrlRepository, redisClient, nanoidStrategy);

export const shorten = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    const savedUrl = await urlService.shortenUrl(originalUrl);
    res.status(201).json(savedUrl);
  } catch (error) {
    console.error('Error in shorten controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const resolve = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await urlService.resolveUrl(shortCode);

    if (!originalUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.redirect(originalUrl);
  } catch (error) {
    console.error('Error in resolve controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
