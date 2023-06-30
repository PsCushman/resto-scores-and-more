SELECT * FROM for_maps_table;

-- Most High Risk Incidents
SELECT business_name, COUNT(*) AS high_risk_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  AND risk_category = 'High Risk'
GROUP BY business_name
ORDER BY high_risk_incidents DESC
LIMIT 5;

-- Lee's Deli 17 Incidents 37.792828 -122.403575

-- Most Incidents overall
SELECT business_name, COUNT(DISTINCT violation_id) AS total_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_name
ORDER BY total_incidents DESC
LIMIT 5;

-- "Peet's Coffee & Tea"	74 37.781127 -122.400109
-- "Lee's Deli"	56

-- Most High Risk Incidents
SELECT business_name, COUNT(*) AS high_risk_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  AND risk_category = 'High Risk'
GROUP BY business_name
ORDER BY high_risk_incidents DESC
LIMIT 5;

-- Lowest AVG Score 
SELECT business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_name
ORDER BY average_score ASC
LIMIT 5;

-- "SUNFLOWER RESTAURANT" 56.2941176470588235

-- How Many Good Spots Are there?
SELECT COUNT(*) AS place_count
FROM (
  SELECT business_name, AVG(inspection_score) AS average_score
  FROM for_maps_table
  WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  GROUP BY business_name
  HAVING COUNT(*) > 4
) AS subquery
WHERE average_score > 95;
-- 159

SELECT COUNT(*) AS school_count
FROM (
  SELECT business_name
  FROM for_maps_table
  WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  GROUP BY business_name
  HAVING COUNT(*) > 4 AND AVG(inspection_score) > 95 AND LOWER(business_name) LIKE '%school%'
) AS subquery;
-- Of the 156, 76 were Schools 

-- Which School did the best?
SELECT business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_name
HAVING COUNT(*) > 4 AND AVG(inspection_score) > 95 AND LOWER(business_name) LIKE '%school%';

-- "ALICE FONG YU ELEMENTARY SCHOOL"

-- Which School had the lowest Score
SELECT business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_name
HAVING COUNT(*) > 4 AND LOWER(business_name) LIKE '%school%'
ORDER BY average_score ASC
LIMIT 1;

-- "Sts. Peter & Paul School"	80.1428571428571429

-- Which School had the most number High Risk Incidents
SELECT business_name, COUNT(*) AS high_risk_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  AND risk_category = 'High Risk'
  AND LOWER(business_name) LIKE '%school%'
GROUP BY business_name
ORDER BY high_risk_incidents DESC
LIMIT 1;

-- "Sts. Peter & Paul School"	3