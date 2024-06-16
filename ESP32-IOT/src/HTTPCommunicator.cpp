#include "HTTPCommunicator.hpp"
#include "WiFi.h"
#include <HTTPClient.h>

#define HTTP_TIMEOUT_MS 10000

HTTPCommunicator::HTTPCommunicator()
{
  httpClient.setTimeout(HTTP_TIMEOUT_MS);
}

bool HTTPCommunicator::sendPostRequest(String url, header_t headers[], size_t numOfHeaders, JsonDocument body)
{
  httpClient.begin(url);

  size_t i = 0;
  for (i = 0; i < numOfHeaders; ++i)
  {
    httpClient.addHeader(headers[i].name, headers[i].value);
  }

  String jsonString;
  serializeJson(body, jsonString); // check body received in function

  int responseCode = httpClient.POST(jsonString); // receives response code 400! (bad request)
  Serial.println("http response code: ");
  Serial.println(responseCode);

  httpClient.end();
  return (responseCode >= 200 && responseCode < 300);
}