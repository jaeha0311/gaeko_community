-- Add location fields to users table
ALTER TABLE users 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN location_name TEXT;

-- Add index for location-based queries
CREATE INDEX idx_users_location ON users(latitude, longitude); 