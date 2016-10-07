## Vegansk Scraper

Den veganska scrapern skrapar veganska hemsidor efter namn på recept med medföljande länk.
Recept och receptlänk läggs in i en databas.

### Användning:

En scraper som använder Node js.  
Installera dependencies med npm install i terminalen  

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
- matklubben och mytaste ger double callback
- vegoteket och vegomatsedel har slutat funka

#### Att-göra:
- automatisera databashanteringen

##### Löpande:
- Hitta fler hemsidor att skrapa
