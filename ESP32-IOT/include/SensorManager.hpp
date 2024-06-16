#ifndef SENSORMANAGER_H
#define SENSORMANAGER_H

#include <cstddef>

class SensorManager {
  private:
    const int sensorPin;

  public:
  SensorManager(int sensorPin);
  void measure(long measurements[], size_t times, size_t interval);
  long measure();
};

#endif //SENSORMANAGER_H