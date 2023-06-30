DROP TABLE IF EXISTS useful_table;
DROP TABLE IF EXISTS business_info_table;
DROP TABLE IF EXISTS inspection_info_table;
DROP TABLE IF EXISTS for_maps_table;

CREATE TABLE IF NOT EXISTS useful_table (
    business_id INT,
    business_name VARCHAR,
    business_address VARCHAR,
    business_city VARCHAR,
    business_latitude NUMERIC,
    business_longitude NUMERIC,
    business_location  VARCHAR,
    inspection_id VARCHAR,
    inspection_date DATE,
    inspection_score INT,
    violation_id VARCHAR,
    violation_description VARCHAR,
    risk_category VARCHAR
);

CREATE TABLE IF NOT EXISTS inspection_info_table (
    business_id INT,
    inspection_id VARCHAR,
    inspection_date DATE,
    inspection_score INT,
    violation_id VARCHAR,
    violation_description VARCHAR,
    risk_category VARCHAR
);

CREATE TABLE IF NOT EXISTS business_info_table (
    business_id INTEGER,
    business_name VARCHAR,
    business_address VARCHAR,
    business_city VARCHAR,
    business_latitude NUMERIC,
    business_longitude NUMERIC,
    business_location VARCHAR
);

CREATE TABLE IF NOT EXISTS for_maps_table (
    business_name VARCHAR,
    business_address VARCHAR,
    business_latitude NUMERIC,
    business_longitude NUMERIC,
    business_location VARCHAR,
    inspection_date DATE,
    inspection_score NUMERIC,
    violation_id VARCHAR,
    violation_description VARCHAR,
    risk_category VARCHAR
);

SELECT * FROM useful_table;
SELECT * FROM for_maps_table
SELECT * FROM business_info_table
SELECT * FROM inspection_info_table