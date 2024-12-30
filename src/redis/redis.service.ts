import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async addToSet<T>(setName: string, value: T, expirationSeconds?: number) {
    const serializedValue = JSON.stringify(value);
    await this.client.sAdd(setName, serializedValue);
    if (expirationSeconds) {
      await this.client.expire(setName, expirationSeconds);
    }
  }

  async getSetValues<T>(setName: string): Promise<T[]> {
    const values = await this.client.sMembers(setName);
    return values.map((value) => JSON.parse(value));
  }

  async getSetValue<T>(
    setName: string,
    predicate: (value: T) => boolean,
  ): Promise<T | null> {
    const values = await this.getSetValues<T>(setName);
    const foundValue = values.find(predicate);
    return foundValue || null;
  }

  async delete(keys: string[]) {
    await this.client.del(keys);
  }

  async setSingleValue(key: string, value: any, expirationSeconds?: number) {
    const serializedValue = JSON.stringify(value);
    await this.client.set(key, serializedValue);
    if (expirationSeconds) {
      await this.client.expire(key, expirationSeconds);
    }
  }

  async getSingleValue<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }
}
