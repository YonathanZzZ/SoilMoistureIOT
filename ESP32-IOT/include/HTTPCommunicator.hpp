#ifndef HTTPCOMMUNICATOR_H
#define HTTPCOMMUNICATOR_H

#include <ArduinoJson.h>
#include <HTTPClient.h>

class HTTPCommunicator{
  public:
    typedef struct header{
      String name;
      String value;
    } header_t;

    HTTPCommunicator();
    bool sendPostRequest(String url, header_t headers[], size_t numOfHeaders, JsonDocument body);

  private:
    HTTPClient httpClient;
};

#endif //HTTPCOMMUNICATOR_H

