import Url from '../models/Url.js';

class UrlRepository {
  async saveUrl(urlData) {
    const url = new Url(urlData);
    return await url.save();
  }

  async findByCode(shortCode) {
    return await Url.findOne({ shortCode });
  }

  async incrementClick(shortCode) {
    return await Url.updateOne({ shortCode }, { $inc: { clickCount: 1 } });
  }
}

export default new UrlRepository();
