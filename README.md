![Screen Shot 2023-07-11 at 11 39 56 PM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/69feef1d-5228-4022-9880-b97592c25893)

# San Francisco Restaurant Scores
A Map Making Story by David Alfonso, Leo Pierantoni, and Payson Cushman

Wash your hands you filthy animal!!!

## Deployment
https://pscushman.github.io/project-story-map/

https://pscushman.github.io/project-cluster-map/

https://dalfonsonash.github.io/resto_choropleth/

https://lpieran.github.io/SFRestaurant_Inspection_Scores_Map/

The Story Map will lead the way...
To see the Flask maps, you will need to download those maps and run them on a localhost.

## Overview
Our Project utilizes the San Francisco Restaurant Scores provided by the SF government at https://datasf.org/opendata/. We utilized both historical data, stored downloaded to a csv and live data gather through API calls.

We created a Story Map (see first screenshot), which allows the user to click links to different maps including:

- A Searchable, Filterable, Cluster Map - Showing live inspection scores of each resturant in SF

![Screen Shot 2023-07-12 at 8 58 37 AM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/86d6843b-5b4b-4aec-84f4-2fd76f205a52)

- A Choropeth Map - colorcoded using the zipcode and inspection score
  
![Screen Shot 2023-07-12 at 8 50 37 AM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/14011ebd-8d39-43d4-88a2-491df05a59f8)

- A Interactive Map - using historical data, filterable by year, risk category, and inspection score (maybe bar graphs)
  
![Screen Shot 2023-07-12 at 8 49 57 AM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/aab9b3aa-fd4d-4ac3-8669-b2d4caf1fd39)

- Combo Heat Map and Marker Map - showing only the resurants with recent high risk incidents run through Flask and manipulated using Python and Pandas then moved through the html to JS using Jinja variables.
  
![Screen Shot 2023-07-12 at 2 24 17 PM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/c29a60d3-ad03-4451-9d93-ac54812957f7)


The Story Map also includes information gathered through SQL queries. 

Before we could import the data for the quieries, we need to apply “thiccc” manipulations on the data using Python - transformations, data and date conversions, and dropping/converting null rows. Just some of the manipulations in the screenshot below:

![Screen Shot 2023-07-12 at 8 55 27 AM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/c35d66c7-a99c-4d8b-8a64-4ad32f7d703b)

The data was then imported to a SQL database and table to then preform the queries. Some examples below:

![Screen Shot 2023-07-12 at 8 49 16 AM](https://github.com/PsCushman/resto-scores-and-more/assets/122395437/217fff1f-4c92-462c-8e77-bbf83ed46568)

-- Most High Risk Incidents: -- "KING OF THAI NOODLE HOUSE", but really a bunch with 3

-- Most Incidents Overall: -- Gateway High/Kip Schools 7 -- "TAQUERIA CANCUN" 6

-- Who Had the most Inspections?: -- Schools and Taqeria Cancun

-- Lowest AVG Score: -- "New Jumbo Seafood Restaurant"	60.5 -- "SUNFLOWER RESTAURANT"	63.5

-- Which School Did the Best?: -- "Francisco Middle School"	96.4 -- "Everett Middle School"	96.16

-- Which School Had the Lowest Score?: --"TENDERLOIN ELEMENTARY SCHOOL"	89.4


## Project Rubric
Data and Delivery (25 points)

Data components used in the project are clearly documented. (5 points)

The dataset contains at least 100 unique records. (5 points)

A database is used to house the data (SQL, MongoDB, SQLite, etc.). (5 points)

The project is powered by a Python Flask API and includes HTML/CSS, JavaScript, and the chosen database. (10 points)

Take in a dataset(through API,  local download (.csv/.xlsx/etc), web scraping, etc), applying “thiccc” manipulations on the data using Python(transformations, data conversions, groupby, etc) 
That data is then thrown into a database of your choice(SQL, MongoDB, SQLite, etc.)
Flask API is used to distribute data. So it is used to implement a server and connect data locally (between a DB and code).
Flask is first shown in week 10, day 3, activity 4  
https://flask.palletsprojects.com/en/2.3.x/ 
Your Javascript/HTML/CSS file makes an API call to the Flask APIs and  provides interactivity through dropdowns, Plotly/Leaflet/Dashboard charts and/or other front end development

Back End (25 points)

The page created to showcase data visualizations runs without error. (7.5 points)

A JavaScript library not shown in class is used in the project(Make it known in your readme what it is and how it works). (7.5 points)

The project conforms to one of the following designs: (10 points)

A Leaflet or Plotly chart built from your data  OR

A dashboard page with multiple charts that all reference the same data.

Visualizations (25 points)

A minimum of three unique views that present the data. (5 points)

Multiple user-driven interactions (such as dropdowns, filters, or a zoom feature) are included on the final page. (5 points)

The final page displays visualizations in a clear, straightforward manner. (5 points)

The data story is easy to interpret for users of all levels. (10 points)

Group Presentation (25 points)
All group members speak equally during the presentation. (5 points)

Presentations are a MAX of 10 minutes, everyone has cams on 

The content is relevant to the project. (5 points)

The presentation maintains audience interest. (5 points)

Content, transitions, and conclusions flow smoothly within any time restrictions. (10 points)

ReadMe has a summary of the project, methods used, results and a conclusion
Nice to haves : 
Contributing members
References 

## Resources and Refrences
https://github.com/atlefren/storymap

https://github.com/stefanocudini/leaflet-search

https://www.w3schools.blog/jinja-loop-index-assembly

