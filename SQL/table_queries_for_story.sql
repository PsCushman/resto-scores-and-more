SELECT * FROM for_maps_table;

-- Most High Risk Incidents:
SELECT business_id, business_name, COUNT(*) AS high_risk_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  AND risk_category = 'High Risk'
GROUP BY business_id, business_name
ORDER BY high_risk_incidents DESC
LIMIT 5;
-- "KING OF THAI NOODLE HOUSE" really a bunch with 3

-- Most Incidents Overall:
SELECT business_id, business_name, COUNT(DISTINCT violation_id) AS total_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_id, business_name
ORDER BY total_incidents DESC
LIMIT 5;

-- Gateway High/Kip Schools 7
-- "TAQUERIA CANCUN" 6

--Who Had the most Inspections?:
SELECT business_id, business_name, COUNT(*) AS inspection_count
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_id, business_name
ORDER BY inspection_count DESC
LIMIT 5;
-- Schools and Taqeria Cancun

-- Lowest AVG Score:
SELECT business_id, business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_id, business_name
ORDER BY average_score ASC
LIMIT 5;

-- "New Jumbo Seafood Restaurant"	60.5000000000000000	2
-- "SUNFLOWER RESTAURANT"	63.5000000000000000	2

SELECT business_id, business_name, COUNT(*) AS lee_count
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03' AND (business_name) LIKE 'Lee%'
GROUP BY business_id, business_name
ORDER BY lee_count DESC
LIMIT 5;
--4 Lee's Deli Locations over that time with multiple inspections

SELECT business_id, business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03' AND (business_name) LIKE 'Lee%'
GROUP BY business_id, business_name
ORDER BY average_score ASC
LIMIT 5;
--The avg Score was not great, but not as bad as my previous queries (83.9333333333333333)

SELECT business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03' AND (business_name) LIKE 'Lee%''%Deli'
GROUP BY business_name
ORDER BY average_score ASC
LIMIT 5;

-- Really what we want is, lowest score and most incidents per visit:
SELECT 
  business_id, 
  business_name, 
  COUNT(*) AS total_incidents, 
  COUNT(*) / COUNT(DISTINCT inspection_date) AS incidents_per_visit, 
  AVG(inspection_score) AS average_score,
  COUNT(DISTINCT inspection_date) AS total_visits
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_id, business_name
ORDER BY incidents_per_visit DESC, average_score ASC
LIMIT 5;

-- "New Jumbo Seafood Restaurant"	2	1	60.5000000000000000
-- "SUNFLOWER RESTAURANT"	2	1	63.5000000000000000

-- How Many Good Spots Are There?:
SELECT COUNT(*) AS place_count
FROM (
  SELECT business_id, business_name, AVG(inspection_score) AS average_score
  FROM for_maps_table
  WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  GROUP BY business_id, business_name
  HAVING COUNT(*) > 2
) AS subquery
WHERE average_score > 92;
--379

-- How Many where Schools?:
SELECT COUNT(*) AS school_count
FROM (
  SELECT business_id, business_name
  FROM for_maps_table
  WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  GROUP BY business_id, business_name
  HAVING COUNT(*) > 2 AND AVG(inspection_score) > 92 AND LOWER(business_name) LIKE '%school%'
) AS subquery;

-- 49 of the 379 where schools

-- Which School Did the Best?:
SELECT business_id, business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_id, business_name
HAVING COUNT(*) > 4 AND AVG(inspection_score) > 95 AND LOWER(business_name) LIKE '%school%'
ORDER BY average_score DESC;

-- "Francisco Middle School"	96.4000000000000000
-- "Everett Middle School"	96.1666666666666667

-- Which School Had the Lowest Score?:
SELECT business_id, business_name, AVG(inspection_score) AS average_score
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
GROUP BY business_id, business_name
HAVING COUNT(*) > 4 AND LOWER(business_name) LIKE '%school%'
ORDER BY average_score ASC
LIMIT 1;
--"TENDERLOIN ELEMENTARY SCHOOL"	89.4000000000000000

-- Which School Had the Most Number of High Risk Incidents?:
SELECT business_id, business_name, COUNT(*) AS high_risk_incidents
FROM for_maps_table
WHERE inspection_date BETWEEN '2016-10-04' AND '2019-10-03'
  AND risk_category = 'High Risk'
  AND LOWER(business_name) LIKE '%school%'
GROUP BY business_id, business_name
ORDER BY high_risk_incidents DESC
LIMIT 5;
-- Lots with 2