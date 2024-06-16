#include "WiFiManager.hpp"
#include "WiFi.h"

#define WIFI_CONNECTION_DELAY_MS 1000

WiFiManager::WiFiManager(String ssid, String password) : ssid(ssid), password(password) {}
bool WiFiManager::connect(size_t timeout)
{
  bool res = true;

  WiFiClass::mode(WIFI_MODE_STA); // set mode for connecting to an existing network
  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();
  while (WiFiClass::status() != WL_CONNECTED && millis() - startAttemptTime < timeout)
  {
    delay(WIFI_CONNECTION_DELAY_MS);
  }

  if (WiFiClass::status() != WL_CONNECTED)
  {
    res = false;
  }

  return res;
}

void WiFiManager::disconnect()
{
  WiFi.disconnect(true);
}
bool WiFiManager::isConnected()
{
  return WiFi.isConnected();
}