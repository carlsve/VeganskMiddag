#!/bin/bash

echo scraping vegokoll...
node scrape_single_website.js "vegokoll"

echo scraping tasteline...
node scrape_single_website.js "tasteline"

echo setting up database...
node database_search.js

echo Done!
