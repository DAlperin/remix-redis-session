import { SessionIdStorageStrategy, SessionStorage, createSessionStorageFactory } from "@remix-run/server-runtime";
import { createCookie } from "@remix-run/node";


import { randomBytes as crypto_randomBytes } from "crypto";

import Redis from "ioredis";
function genRandomID(): string {
    const randomBytes = crypto_randomBytes(8);
    return Buffer.from(randomBytes).toString("hex");
}

const expiresToSeconds = (expires: Date) => {
    const now = new Date();
    const expiresDate = new Date(expires);
    const secondsDelta = Math.round((expiresDate.getTime() - now.getTime())/1000);
    return secondsDelta < 0 ? 0 : secondsDelta;
};

type redisSessionArguments = {
    cookie: SessionIdStorageStrategy["cookie"];
    options: {
        redisConfig?: Redis.RedisOptions,
        redisClient?: Redis.Redis
    }
};

export function createRedisSessionStorage({
    cookie,
    options
}: redisSessionArguments): SessionStorage {
    let redis: Redis.Redis
    if (options.redisClient) {
        redis = options.redisClient
    } else if (options.redisConfig) {
        redis = new Redis(options.redisConfig);
    } else {
        throw new Error("Need to provide either options.RedisConfig or options.redisClient")
    }
    const createSessionStorage = createSessionStorageFactory(createCookie)
    return createSessionStorage({
        cookie,
        async createData(data, expires) {
            const id = genRandomID();
            if (expires) {
                await redis.set(
                    id,
                    JSON.stringify(data),
                    "EX",
                    expiresToSeconds(expires)
                );
            } else {
                await redis.set(id, JSON.stringify(data));
            }
            return id;
        },
        async readData(id) {
            const data = await redis.get(id);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        },
        async updateData(id, data, expires) {
            if (expires) {
                await redis.set(
                    id,
                    JSON.stringify(data),
                    "EX",
                    expiresToSeconds(expires)
                );
            } else {
                await redis.set(id, JSON.stringify(data));
            }
        },
        async deleteData(id) {
            await redis.del(id);
        },
    });
}
