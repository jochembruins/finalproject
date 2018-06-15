#!/usr/bin/python

# CSV2JSON.py
# Converts CSV to JSON Fike
# Door Jochem Bruins - 10578811
# Thanks to Andy m. Boyle
# Link to manual: http://www.andymboyle.com/2011/11/02/quick-csv-to-json-parser-in-python/

import csv
import json

# open CSV  
csvfile = open('dataPlot.csv', 'r', encoding = 'utf-8-sig')  

# declare field names
reader = csv.DictReader(csvfile, delimiter = ';', fieldnames = ("CODE", "CITY", "E33", "GGZ"))  

# parse CSV into JSON  
output = json.dumps([row for row in reader])  

print("JSON parsed!")  

# save  JSON  
f = open('dataPlot.json', 'w')  
f.write('{"data":' + output + '}')  

print("JSON saved!")