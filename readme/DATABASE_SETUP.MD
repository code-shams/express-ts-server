# Database Setup: PostgreSQL with Raw SQL

This document outlines the database integration for the Express TypeScript server using the `pg` driver and raw SQL.

## 1. Technology Stack
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **Driver**: [`pg` (node-postgres)](https://node-postgres.com/)
- **Strategy**: Raw SQL queries with a connection pool for performance and simplicity.

## 2. Connection Pattern
We use a **Connection Pool**. Pools are preferred over single clients for web servers because they manage multiple concurrent connections and reconnect automatically if a connection is lost.

> [!NOTE]
> The connection string is obtained directly from your **Neon DB Project** dashboard. Ensure you use the "Pooled" connection string if you're using serverless functions, though the standard one works here as we are using the `pg` pool.

### Minimal Configuration
```typescript
import { Pool } from "pg";

// Get this string from your Neon Dashboard
const pool = new Pool({
  connectionString: "YOUR_CONNECTION_STRING"
});
```

## 3. Schema Definition
The database is initialized automatically on server start via the `initDB` function.

### Users Table
| Column | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Next integer |
| `name` | `VARCHAR(255)` | `NOT NULL` | - |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | - |
| `password` | `VARCHAR(255)` | `NOT NULL` | - |
| `created_at` | `TIMESTAMP` | - | `NOW()` |
| `updated_at` | `TIMESTAMP` | - | `NOW()` |

## 4. RAW SQL CRUD Examples

### Create (Insert)
```sql
INSERT INTO users (name, email, password) 
VALUES ($1, $2, $3) 
RETURNING *;
```

### Read (Select All)
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### Read (Select by ID)
```sql
SELECT * FROM users WHERE id = $1;
```

### Update
```sql
UPDATE users 
SET name = $1, email = $2 
WHERE id = $3 
RETURNING *;
```

### Delete
```sql
DELETE FROM users WHERE id = $1;
```

## 5. Usage in Express Routes

When using the `pool` in routes, follow the `async/await` pattern with `try/catch` blocks:

```typescript
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```

---

## Tips for Neon DB
- **Auto-Initialization**: The `initDB` function in `src/main.ts` ensures that your table structure exists before the first request arrives.
- **SSL**: Since Neon requires SSL, the connection string must include `?sslmode=require`.
