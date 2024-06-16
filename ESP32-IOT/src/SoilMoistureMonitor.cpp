#include "SoilMoistureMonitor.hpp"
#include "Utils.hpp"

#define NUM_OF_HEADERS 3

SoilMoistureMonitor::SoilMoistureMonitor(String serverURL, String wifiSSID, String wifiPassword,
                                         int sensorPin, String deviceID, String deviceSecretKey, int dryValue, int wetValue) : serverURL(serverURL), dryValue(dryValue), wetValue(wetValue), deviceID(deviceID), deviceSecretKey(deviceSecretKey),
                                                                                                                                         wifiManager(wifiSSID, wifiPassword), httpCommunicator(), sensorManager(sensorPin)
{
}

unsigned char SoilMoistureMonitor::measureMoisturePercentage()
{
  return measureMoisturePercentage(1, 0);
}
unsigned char SoilMoistureMonitor::measureMoisturePercentage(size_t numOfMeasurements, size_t interval)
{
  long *measuredVoltages = new long[numOfMeasurements];
  sensorManager.measure(measuredVoltages, numOfMeasurements, interval);
  long median = Utils::getMedian(measuredVoltages, numOfMeasurements);
  delete[] measuredVoltages;

  return Utils::voltageToPercent(median, dryValue, wetValue);
}

bool SoilMoistureMonitor::isWiFiConnected()
{
  return wifiManager.isConnected();
}

bool SoilMoistureMonitor::connectToWiFi(size_t timeout)
{
  return wifiManager.connect(timeout);
}

void SoilMoistureMonitor::disconnectWiFi()
{
  wifiManager.disconnect();
}

bool SoilMoistureMonitor::sendMeasurementToServer(unsigned char measurement)
{
  HTTPCommunicator::header_t headers[NUM_OF_HEADERS];

  headers[0] = {"Content-Type", "application/json"};
  headers[1] = {"Device-Identifier", deviceID};
  headers[2] = {"Device-Secret", deviceSecretKey};

  JsonDocument body;
  body["measuredValue"] = measurement;
  return httpCommunicator.sendPostRequest(serverURL, headers, NUM_OF_HEADERS, body); //crashes here
}