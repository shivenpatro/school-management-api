const express = require('express');
const { body, query, validationResult } = require('express-validator');
const pool = require('../config/db');
const { getDistanceInKm } = require('../utils/distance');

const router = express.Router();

// Helper middleware for handling validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * POST /addSchool
 * Adds a new school to the database after validating the request body.
 */
router.post(
  '/addSchool',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a valid coordinate'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a valid coordinate')
  ],
  handleValidationErrors,
  async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    try {
      const [result] = await pool.execute(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, address, latitude, longitude]
      );

      return res.status(201).json({
        id: result.insertId,
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
    } catch (error) {
      console.error('Error inserting school:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * GET /listSchools
 * Lists schools sorted by distance from the user-provided coordinates.
 * Query parameters: latitude, longitude
 */
router.get(
  '/listSchools',
  [
    query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude query param is required'),
    query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude query param is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    try {
      const [schools] = await pool.execute('SELECT * FROM schools');

      // Calculate distance for each school
      const schoolsWithDistance = schools.map((school) => {
        const distance = getDistanceInKm(userLat, userLon, school.latitude, school.longitude);
        return { ...school, distance };
      });

      // Sort by distance
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      return res.json(schoolsWithDistance);
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router; 