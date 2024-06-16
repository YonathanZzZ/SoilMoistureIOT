#ifndef SOILMOISTUREMONITOR_H
#define SOILMOISTUREMONITOR_H

#include <cstddef>
#include "WiFiManager.hpp"
#include "HTTPCommunicator.hpp"
#include "SensorManager.hpp"

class SoilMoistureMonitor
{
public:
  SoilMoistureMonitor(String serverURL, String wifiSSID, String wifiPassword,
                      int sensorPin, String deviceID, String deviceSecretKey, int dryValue, int wetValue);
  unsigned char measureMoisturePercentage();
  unsigned char measureMoisturePercentage(size_t numOfMeasurements, size_t interval);
  bool sendMeasurementToServer(unsigned char measurement);
  bool connectToWiFi(size_t timeout);
  void disconnectWiFi();
  bool isWiFiConnected();

private:
  String serverURL;
  String deviceID;
  String deviceSecretKey;
  int dryValue;
  int wetValue;

  // class instances
  WiFiManager wifiManager;
  HTTPCommunicator httpCommunicator;
  SensorManager sensorManager;
};

#endif // SOILMOISTUREMONITOR_H