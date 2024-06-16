#include "Utils.hpp"
#include <cstddef>
#include <algorithm>
#include <Arduino.h>

long Utils::getMedian(long values[], size_t size)
{
  int res = 0;
  std::sort(values, values + size);

  if (size % 2 != 0)
  {
    res = values[size / 2];
  }
  else
  {
    // even num of elements
    res = (values[size] + values[size - 1]) / 2;
  }

  return res;
}

unsigned char Utils::voltageToPercent(long measuredValue, int minValue, int maxValue)
{
  long value = map(measuredValue, minValue, maxValue, 0, 100);
  value = constrain(value, 0, 100);

  return value;
}