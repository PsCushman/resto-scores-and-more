import pandas as pd
import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# Set up the API base URL
baseURL = "https://data.sfgov.org/resource/pyih-qa8i.json?"

@app.route('/', methods=['GET', 'POST'])
def home():
    # Fetch data from the API
    response = requests.get(baseURL)
    if response.status_code == 200:
        # Convert the JSON response to a pandas DataFrame
        restaurants = pd.DataFrame(response.json())

        # Filter restaurants by risk category
        high_risk_restaurants = restaurants[restaurants['risk_category'] == 'High Risk']

        # Convert filtered DataFrame to dictionary
        restaurants_dict = high_risk_restaurants.to_dict(orient='records')

        # Pass the restaurant data to the template
        return render_template('index.html', restaurants=restaurants_dict)
    else:
        return 'Error fetching data from the API'

if __name__ == "__main__":
    app.run(debug=True)