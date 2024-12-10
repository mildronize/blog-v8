+++
title = "Simple SOAP client and simple server via flask"
description = "Using python to get current oil price in Thailand via SOAP and response in JSON format."
date = "2015-05-04"

[taxonomies]
tags = [ "SOAP", "SOAP Client", "Python", "Flask" ]
categories = [ "SOAP" ]

[extra]
id = "91bu9k0"
unsplashImgCoverId = "DlZD4V2j9oM"
+++

## Objective:
To get current oil price in Thailand via SOAP and response in JSON format.
SOAP Server URL for this scirpt: [http://www.pttplc.com/webservice/pttinfo.asmx?WSDL]

## Prerequisite:
- Python 3.4
- flask
- flask-cors
- suds-jurko
- xmltodict

This script is located in <https://gist.github.com/mildronize/56a35fb6d26d0e9002a1>

```python
#!/usr/bin/python3

from flask import Flask
from flask import request, jsonify
from flask.ext.cors import CORS
from suds.client import Client
import xmltodict

app = Flask(__name__)
cors = CORS(app)

@app.route("/apis/get-oil-price" , methods=['POST'])
def get_oil_price():
	# Get variable from http POST
	date_string = str(request.form['date'])
	date_string = date_string.split('-')
	day = date_string[2]
	month = date_string[1]
	year = date_string[0]
	# Get SOAP Service via suds
	url = 'http://www.pttplc.com/webservice/pttinfo.asmx?WSDL'
	client = Client(url)
	# Execute GetOilPrice method of SOAP
	xml = client.service.GetOilPrice("EN", day, month, year)
	# Convert XML to dict
	res_dict = xmltodict.parse(xml)
	result = {}
	result['result'] = res_dict['PTT_DS']['DataAccess']
	# Convert dict to JSON
	return jsonify(**result)

@app.route("/apis/current-oil-price" , methods=['GET'])
def oil_current_price():
	# Get SOAP Service via suds
	url = 'http://www.pttplc.com/webservice/pttinfo.asmx?WSDL'
	client = Client(url)
	# Execute CurrentOilPrice method of SOAP
	xml = client.service.CurrentOilPrice("EN")
	# Convert XML to dict
	res_dict = xmltodict.parse(xml)
	result = {}
	result['result'] = res_dict['PTT_DS']['DataAccess']
	# Convert dict to JSON
	return jsonify(**result)

if __name__ == "__main__":
    app.run(host='0.0.0.0')
```

[http://www.pttplc.com/webservice/pttinfo.asmx?WSDL]: http://www.pttplc.com/webservice/pttinfo.asmx?WSDL
