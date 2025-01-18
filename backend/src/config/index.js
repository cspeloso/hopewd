module.exports = {
    port: process.env.PORT || 5001,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    dbConfig: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'dbname',
    },
    corsOptions: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  };