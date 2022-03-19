# remix-redis-session

A simple library to use redis as your session backing store in your remix project

## Install

`npm install remix-redis-session` or `npm install remix-redis-session`

## Api

```ts
createRedisSessionStorage({
    cookie: SessionIdStorageStrategy["cookie"]
    options: {
        redisConfig?: Redis.RedisOptions,
        redisClient?: Redis.Redis
    }
})
```

## Examples

```ts
// With redisConfig
export const sessionStorage = createRedisSessionStorage({
    cookie: {
        name: "example",
        secure: true,
        sameSite: "lax",
        secrets: ["s3cr3t"],
        path: "/",
        httpOnly: true,
    },
    options: {
        redisConfig: {
            port: 6379,
            family: 6,
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD ?? undefined,
        }
    }
});

// With redisClient
const redis = new Redis({
    port: 6379,
    family: 6,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD ?? undefined,
});

export const sessionStorage = createRedisSessionStorage({
    cookie: {
        name: "example",
        secure: true,
        sameSite: "lax",
        secrets: ["s3cr3t"],
        path: "/",
        httpOnly: true,
    },
    options: {
        redisClient: redis
    }
});
```

## Buy me a coffee :)

[:heart: Sponsor](https://github.com/sponsors/DAlperin)

