import { nanoid } from 'nanoid';
import ShortCodeStrategy from './ShortCodeStrategy.js';

export default class NanoidStrategy extends ShortCodeStrategy {
  generate() {
    return nanoid(7);
  }
}
