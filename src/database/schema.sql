-- Sweet Shop Database Schema

-- Drop table if exists (for fresh setup)
DROP TABLE IF EXISTS sweets;

-- Create sweets table
CREATE TABLE sweets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX idx_sweets_name ON sweets(name);
CREATE INDEX idx_sweets_category ON sweets(category);
CREATE INDEX idx_sweets_price ON sweets(price);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_sweets_updated_at
    BEFORE UPDATE ON sweets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO sweets (name, category, price, quantity) VALUES
    ('Chocolate Bar', 'chocolate', 2.50, 100),
    ('Gummy Bears', 'candy', 1.99, 150),
    ('Croissant', 'pastry', 3.50, 50);
