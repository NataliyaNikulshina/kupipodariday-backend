export default () => ({
  port_nest: parseInt(process.env.PORT_NEST, 10) || 5000,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 5432,
  database: process.env.DATABASE_DATABASE || 'kupipodariday',
  username: process.env.DATABASE_USER || 'student',
  password: process.env.DATABASE_PASSWORD || 'student',
  synchronize: Boolean(process.env.SYNCHRONIZE) || true,
  JWT_SECRET: process.env.JWT_SECRET,
});
