
# Soil Moisture Monitoring Project

## Overview

This project aims to help users monitor the moisture level in soil using an ESP32 microcontroller and a moisture sensor. The system consists of three main components:

1. **ESP32 Device**: Measures soil moisture periodically and sends the data to a server.
2. **Server**: Built using Express (Node.js) and a MySQL database, the server handles user registration, device management, and data storage.
3. **Client Webapp**: A web application developed with Next.js to provide a user interface for monitoring the soil moisture data and displaying statistics.

## Features

- **ESP32 Device (written in C++)**: 
  - Periodically measures soil moisture using a sensor.
  - Sends moisture data to the server for storage.

- **Server (written in TypeScript)**:
  - User registration and authentication.
  - Device registration, providing a unique device identifier and secret key.
  - Data storage and management using MySQL (via Primsa).

- **Client Webapp (written in TypeScript)**:
  - User interface for adding monitoring devices.
  - Current moisture level and graphs to visualize the moisture levels of the plants.

## Usage

1. **Register a User**:
   - Use the webapp to register a new user.
  
2. **Set up the Device**:
   - Connect a Capacitive Soil Moisture Sensor to the ESP32. Use pin 2 for the signal wire.
   
3. **Register a Device**:
   - Once a user is registered, log into it and use the Add Device button in the sidebar. 
   - Add the provided Device ID and Secret Key to the config file, along with WiFi credentials
   - Upload the data to the ESP32 (this saves the config file into the controller's flash storage)
   - Write the program into the ESP32

4. **Monitor Moisture Data**:
   - Connect the ESP32 to a power source via USB C.
   - Insert the sensor into the soil. The depth should be as indicated on the sensor (horizontal white line)
   - The ESP32 device periodically sends moisture data to the server.
   - Use the webapp to view the moisture levels and statistics for your device(s).

## Roadmap

- Complete the development of the client webapp.
- Implement data visualization features (graphs and charts) to show moisture level statistics.
- Add more detailed usage instructions and examples.
