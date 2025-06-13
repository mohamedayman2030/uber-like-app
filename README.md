### 🚖 Uber-like App Backend

A scalable backend system for an Uber-like ride-hailing app built with Node.js, PostgreSQL, Redis, Socket.io, and S2 Geometry. The app handles real-time location tracking, ride matching, trip management, and rider-driver authentication.

### 🧩 Features

## 👥 User Roles

Riders: Request trips from a location to a destination.

Drivers: Accept or decline trips in real time.

## 🔐 Authentication

JWT-based authentication for riders and drivers

Middleware support for route protection and socket auth

## 📡 WebSocket Communication

Namespaced connections:

/riders: For rider-client communication

/drivers: For driver-client communication

Real-time events:

startReceivingRides → Drivers subscribe to new trips

requestRide → Sent to drivers for ride acceptance

## 📍 Geolocation & Matching (S2 + Redis)

S2 Cells: Earth's surface divided into grid cells

Redis: Quick lookups of drivers by cell IDs

Match riders to closest drivers within neighboring cells

## 🛣️ Route Estimation (OpenRouteService)

Calculate estimated trip duration (ETA) using real routes

🚦 Trip Lifecycle

Trip request (pending)

Accepted by driver

Transition through: 'PENDING', 'ACCEPTED', 'RUNNING', 'FINISHED', 'CANCELLED'

## 🗃️ Database Schema

```sql

CREATE TABLE riders (id SERIAL PRIMARY KEY,name VARCHAR(50) NOT NULL,password VARCHAR(60) NOT NULL,email VARCHAR(50),photo VARCHAR(200), phone VARCHAR(15) NOT NULL);

CREATE TABLE drivers (id SERIAL PRIMARY KEY,username VARCHAR(50) NOT NULL,email  VARCHAR(50) UNIQUE,photo VARCHAR(200) NOT NULL, phone VARCHAR(20) NOT NULL, vehicle_type VARCHAR(50) NOT NULL, vehicle_name VARCHAR(50) NOT NULL, vehicle_no  VARCHAR(10) UNIQUE NOT NULL, password VARCHAR(200) NOT NULL);

CREATE TABLE driver_location (id SERIAL PRIMARY KEY, old_latitude NUMERIC(10,5) NOT NULL, old_longitude NUMERIC(10,5) NOT NULL, new_latitude NUMERIC(10,5) NOT NULL, new_longitude NUMERIC(10,5) NOT NULL,driver_id INT NOT NULL,CONSTRAINT fk_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE);

CREATE TABLE trips (id SERIAL PRIMARY KEY, rider_id INT NOT NULL , driver_id INT NOT NULL, location TEXT NOT NULL, ETA REAL CHECK(ETA>= 0), status VARCHAR(50) CHECK(status IN  ('PENDING', 'ACCEPTED', 'RUNNING', 'FINISHED', 'CANCELLED')),
CONSTRAINT fk_rider FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
CONSTRAINT fk_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
 );

```

## 🐳 Docker Setup
Start containers:
```
docker-compose up --build
```

