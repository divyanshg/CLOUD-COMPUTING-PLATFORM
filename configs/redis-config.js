const redisConfig = {
        port: 6379,
        host: 'server.ccp.com',
        password: process.env.redis_password,
    }
let
    redis = require('redis'),
    publisher = redis.createClient(redisConfig),
    subscriber = redis.createClient(redisConfig);

module.exports = {
    redis,
    publisher,
    subscriber
}