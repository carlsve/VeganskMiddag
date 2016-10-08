## Vegansk Middag

Servern slumpar fram recept att laga till middag, alla recept är veganska.

installera node_modules med npm install  

#### Server:

starta med $ node server.js

#### Scrapertool:  
För att skrapa en enskild hemsida, skriv (i terminalen):  
$ node scrape_single_website.js "website name"
"website name" är någon hemsidas namn till exempel "vegoteket"

#### package dependencies:
  "ejs": "^2.4.2",  
  "express": "^4.13.4",  
  "leveldown": "latest",  
  "levelup": "latest",  
  "x-ray":  "lastest"

#### Buggar:
- mytaste ger double callback
- vegoteket och vegomatsedel ger tom array

#### Att-göra:
- automatisera skrapningen

##### Löpande:
- Hitta fler hemsidor att skrapa
