import pkg from "pg";
import { bd } from "./config.js";

const { Pool } = pkg;

export const pool = new Pool({
  user: bd.user,
  password: bd.password,
  host: bd.host,
  port: bd.port,
  database: bd.database,
});
