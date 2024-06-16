#ifndef WIFIMANAGER_H
#define WIFIMANAGER_H

#include <cstddef>
#include <Arduino.h>

class WiFiManager
{
public:
  WiFiManager(String ssid, String password);
  bool connect(size_t timeout);
  static void disconnect();
  static bool isConnected();

private:
  String ssid;
  String password;
};

#endif // WIFIMANAGER_H