# User guide
## ETA precedence
* `instock` kind: always on top of the list hence will be picked first
* Date kind: string with format `dd/MM/yyyy`. Come right after `instock`, pick nearest date first
* Anything else: always at the bottom of the list. When multiple ship have this kind of eta, the order will match appearing order

## Input preparation
* Input file need 2 first sheets, all others sheet (3rd and further) will not be read
* Converting all cells of 1st and 2nd sheet into string
* Filling template file with values according to header row, changing column's order is not supported
* `Material` column will be used as key column, empty value in this column will stop the reading process
* Orders in 2nd sheet will be fill top down, so sorting them by ascending delivery day is expected

## Insufficient remaining goods
* On any order which required more than the remaining amount of goods, all the remaining goods will be used to fill that order then a special ship with amount=0 invoice=`no goods` will be append to the right of last ship

## Installation
* Visit link: https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-21
* Select download link for `Windows x64 msi`
* Open the downloaded file and start the installation of jdk-21
