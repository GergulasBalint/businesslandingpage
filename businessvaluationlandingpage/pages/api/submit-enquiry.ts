import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Updated to match your .env.local variable names
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || '',  // Empty string if no password
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306')
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log('Received data:', data);

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.companyName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    // Insert data into database
    const [result] = await connection.execute(
      `INSERT INTO enquiries (
        name,
        email,
        phone,
        company_name,
        annual_revenue,
        profit_margin,
        asset_value,
        industry,
        calculated_asset_based,
        calculated_market_multiple,
        calculated_dcf
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.phone,
        data.companyName,
        data.calculationData.revenue || null,
        data.calculationData.profitMargin || null,
        data.calculationData.assetValue || null,
        data.calculationData.industry || null,
        data.result.assetBased,
        data.result.marketMultiple,
        data.result.dcf
      ]
    );

    await connection.end();

    res.status(200).json({ 
      success: true,
      message: 'Enquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error processing enquiry:', error);
    res.status(500).json({ 
      message: 'Error processing enquiry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}