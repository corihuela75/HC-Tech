import pool from "./src/config/db.js"; // tu archivo de configuración

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a MySQL exitosa!");
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    process.exit(1);
  }
}

testConnection();
