-- Normalize category data to fix inconsistent casing

-- Update all variations of "anime" to lowercase "anime"
UPDATE cards 
SET category = 'anime' 
WHERE LOWER(category) LIKE '%anime%' 
   OR LOWER(category) = 'anime';

-- Update all variations of "cars" to lowercase "cars"
UPDATE cards 
SET category = 'cars' 
WHERE LOWER(category) LIKE '%car%' 
   OR LOWER(category) = 'cars'
   OR LOWER(category) = 'car';

-- Show final category distribution
SELECT category, COUNT(*) as count 
FROM cards 
WHERE category IS NOT NULL 
GROUP BY category 
ORDER BY count DESC;