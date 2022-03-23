#!/bin/bash
set -x
curl -XPOST "http://localhost:8001/customerorders/order?customer=$1&amount=$2"