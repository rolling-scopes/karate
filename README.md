# KARATE - Serverless Webscraper

## Webscraper are based by headless chrome and serverless framework

## Setup
 - Install serverless `npm i -g serverless`
 - Create AWS Credentials
 - Install packages `yarn`
 - Run `sls deploy`

## Example
  - POST https://some_aws_address/test/scrape/{page_id}
  - BODY { "query": "value", callback: "https://some_data_url.com" }

## Licence

Copyright 2017 Siarhei Melnik

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this program. If not, see
<http://www.gnu.org/licenses/>.
