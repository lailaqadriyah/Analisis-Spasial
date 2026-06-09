import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import { INITIAL_POOLS } from './initialData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database schema and seed data if empty
async function initDb() {
  try {
    // 1. Create table using double-quoted camelCase columns matching frontend types
    await pool.query(`
      CREATE TABLE IF NOT EXISTS swimming_pools (
        "id" VARCHAR(255) PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "kategori" VARCHAR(100) NOT NULL,
        "jenisKolam" VARCHAR(100) NOT NULL,
        "description" TEXT,
        "address" TEXT,
        "district" VARCHAR(255),
        "ticketPrice" VARCHAR(255),
        "ticketPriceMin" INTEGER DEFAULT 0,
        "rating" NUMERIC(3, 2) DEFAULT 0.0,
        "openingHours" VARCHAR(255),
        "latitude" NUMERIC(12, 9) NOT NULL,
        "longitude" NUMERIC(12, 9) NOT NULL,
        "facilities" TEXT[],
        "status" VARCHAR(100) DEFAULT 'Buka',
        "imageUrl" TEXT
      );
    `);
    console.log('Database schema initialized.');

    // 2. Check if empty and seed
    const { rows } = await pool.query('SELECT COUNT(*) FROM swimming_pools');
    const count = parseInt(rows[0].count);
    
    if (count === 0) {
      console.log('Database is empty. Seeding initial pools data...');
      for (const poolItem of INITIAL_POOLS) {
        await pool.query(`
          INSERT INTO swimming_pools (
            "id", "name", "kategori", "jenisKolam", "description", "address", 
            "district", "ticketPrice", "ticketPriceMin", "rating", "openingHours", 
            "latitude", "longitude", "facilities", "status", "imageUrl"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
          poolItem.id,
          poolItem.name,
          poolItem.kategori,
          poolItem.jenisKolam,
          poolItem.description,
          poolItem.address,
          poolItem.district,
          poolItem.ticketPrice,
          poolItem.ticketPriceMin,
          poolItem.rating,
          poolItem.openingHours,
          poolItem.latitude,
          poolItem.longitude,
          poolItem.facilities,
          poolItem.status || 'Buka',
          poolItem.imageUrl || null
        ]);
      }
      console.log(`Successfully seeded ${INITIAL_POOLS.length} pools.`);
    } else {
      console.log(`Database already has ${count} pools. Skipping seed.`);
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// REST Routes

// GET all pools
app.get('/api/pools', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM swimming_pools ORDER BY "name" ASC');
    // Ensure numeric fields from pg (rating, lat, lng) are parsed as numbers for client
    const pools = result.rows.map(row => ({
      ...row,
      rating: parseFloat(row.rating),
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    }));
    res.json(pools);
  } catch (error: any) {
    console.error('Error in GET /api/pools:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST a new pool
app.post('/api/pools', async (req, res) => {
  const {
    id, name, kategori, jenisKolam, description, address, 
    district, ticketPrice, ticketPriceMin, rating, openingHours, 
    latitude, longitude, facilities, status, imageUrl
  } = req.body;

  if (!name || !kategori || !jenisKolam || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Name, kategori, jenisKolam, latitude, and longitude are required.' });
  }

  const newId = id || `pool-${Date.now()}`;

  try {
    await pool.query(`
      INSERT INTO swimming_pools (
        "id", "name", "kategori", "jenisKolam", "description", "address", 
        "district", "ticketPrice", "ticketPriceMin", "rating", "openingHours", 
        "latitude", "longitude", "facilities", "status", "imageUrl"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      newId,
      name,
      kategori,
      jenisKolam,
      description || '',
      address || '',
      district || '',
      ticketPrice || 'Hubungi lokasi',
      ticketPriceMin || 0,
      rating || 0,
      openingHours || '',
      latitude,
      longitude,
      facilities || [],
      status || 'Buka',
      imageUrl || null
    ]);

    const result = await pool.query('SELECT * FROM swimming_pools WHERE id = $1', [newId]);
    const insertedPool = result.rows[0];
    res.status(201).json({
      ...insertedPool,
      rating: parseFloat(insertedPool.rating),
      latitude: parseFloat(insertedPool.latitude),
      longitude: parseFloat(insertedPool.longitude)
    });
  } catch (error: any) {
    console.error('Error in POST /api/pools:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT (update) a pool
app.put('/api/pools/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // 1. Get current pool data
    const poolRes = await pool.query('SELECT * FROM swimming_pools WHERE id = $1', [id]);
    if (poolRes.rows.length === 0) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    const current = poolRes.rows[0];

    // 2. Prepare merged updates
    const merged = {
      name: updates.name !== undefined ? updates.name : current.name,
      kategori: updates.kategori !== undefined ? updates.kategori : current.kategori,
      jenisKolam: updates.jenisKolam !== undefined ? updates.jenisKolam : current.jenisKolam,
      description: updates.description !== undefined ? updates.description : current.description,
      address: updates.address !== undefined ? updates.address : current.address,
      district: updates.district !== undefined ? updates.district : current.district,
      ticketPrice: updates.ticketPrice !== undefined ? updates.ticketPrice : current.ticketPrice,
      ticketPriceMin: updates.ticketPriceMin !== undefined ? updates.ticketPriceMin : current.ticketPriceMin,
      rating: updates.rating !== undefined ? updates.rating : current.rating,
      openingHours: updates.openingHours !== undefined ? updates.openingHours : current.openingHours,
      latitude: updates.latitude !== undefined ? updates.latitude : current.latitude,
      longitude: updates.longitude !== undefined ? updates.longitude : current.longitude,
      facilities: updates.facilities !== undefined ? updates.facilities : current.facilities,
      status: updates.status !== undefined ? updates.status : current.status,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : current.imageUrl,
    };

    // 3. Update in DB
    await pool.query(`
      UPDATE swimming_pools SET
        "name" = $1,
        "kategori" = $2,
        "jenisKolam" = $3,
        "description" = $4,
        "address" = $5,
        "district" = $6,
        "ticketPrice" = $7,
        "ticketPriceMin" = $8,
        "rating" = $9,
        "openingHours" = $10,
        "latitude" = $11,
        "longitude" = $12,
        "facilities" = $13,
        "status" = $14,
        "imageUrl" = $15
      WHERE "id" = $16
    `, [
      merged.name,
      merged.kategori,
      merged.jenisKolam,
      merged.description,
      merged.address,
      merged.district,
      merged.ticketPrice,
      merged.ticketPriceMin,
      merged.rating,
      merged.openingHours,
      merged.latitude,
      merged.longitude,
      merged.facilities,
      merged.status,
      merged.imageUrl,
      id
    ]);

    const updatedRes = await pool.query('SELECT * FROM swimming_pools WHERE id = $1', [id]);
    const updatedPool = updatedRes.rows[0];
    res.json({
      ...updatedPool,
      rating: parseFloat(updatedPool.rating),
      latitude: parseFloat(updatedPool.latitude),
      longitude: parseFloat(updatedPool.longitude)
    });
  } catch (error: any) {
    console.error('Error in PUT /api/pools:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a pool
app.delete('/api/pools/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const checkRes = await pool.query('SELECT * FROM swimming_pools WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    await pool.query('DELETE FROM swimming_pools WHERE id = $1', [id]);
    res.json({ message: 'Pool successfully deleted', id });
  } catch (error: any) {
    console.error('Error in DELETE /api/pools:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await initDb();
});
