import { SQLDatabase } from "encore.dev/storage/sqldb";

export default new SQLDatabase("hospital_db", {
  migrations: "./migrations",
});
