// Libraries
import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class EnvironmentService {

  #envPath: any;
  #nodeEnv: string = process.env.APP_ENV
    ? process.env.APP_ENV.trim()
    : undefined;

  #envConfig: { [key: string]: string };

  constructor() {
    switch (this.#nodeEnv) {
      case 'local':
        this.#envPath = resolve(process.cwd(), '.env.local');
        break;
      case 'qa':
        this.#envPath = resolve(process.cwd(), '.env.qa');
        break;
      case 'production':
        this.#envPath = resolve(process.cwd(), '.env.production');
        break;
      case 'develop':
        this.#envPath = resolve(process.cwd(), '.env.develop');
        break;
      case 'test':
        this.#envPath = resolve(process.cwd(), '.env.test');
        break;
      default:
        throw new Error('Specify the APP_ENV variable');
    }
    
    this.#envConfig = dotenv.parse(fs.readFileSync(this.#envPath));
  }

  get(key: string): string {
    return this.#envConfig[key] || process.env[key];
  }
}
