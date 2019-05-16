# taxit
Driver-Customer taxi system

## Urls
- Dashboard - https://taxit.herokuapp.com/
- Driver - https://taxit.herokuapp.com/driver.html?id=1
- Customer - https://taxit.herokuapp.com/customer.html
- Specific Customer - https://taxit.herokuapp.com/customer.html?customerId=1

## DB
### Trips Schema
| Column | Description |
|---|---|
| id | Primary key |
| customer_id | id of the user who requested the ride |
| driver_id | id of the driver who have picked the ride |
| status | ENUM between `WAITING|ONGOING|COMPLETED` |
| picked_at | the time at which the trip was started |
| completed_at | the time at which the trip was completed |
| created_at | the time at which the trip was created by the user |
| updated_at | the time at the record was last modified |
## API
#### `GET /trips/:status(ALL|WAITING|ONGOING|COMPLETED)?customerId=&driverId=`
Query - Fetches trips corresponding to the customer, or if the driver id is provided then searches for all trips completed/ongoing by the driver and all waiting trips
Description - Fetches all trip depending on the status mentioned.
Returns - Array of trips

#### `POST /trips`
Query - customerId mandatory to create a trip
Description -  Creates a new trip for the mentioend customer
Returns - Trip object

#### `GET /trips/:id`
Description - Fetches trip corresponding to the id mentioned
Returns - Trip object

#### `GET /trips/:id/start?driverId=`
Query - driverId a mandatory field to ensure that the trip can be started by the mentioned driver
Description - Changes the status of the trip from `WAITING` to `ONGOING` and if the driver is not busy
Returns - Updated Trip object

#### `GET /trips/:id/stop`
Description - Changes the status of the trip from `ONGOING` to `COMPLETED` and if the trip is not completed
Returns - Updated Trip object

