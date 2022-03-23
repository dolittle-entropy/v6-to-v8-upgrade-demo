#!/bin/bash
set -x
curl -XPOST "http://localhost:8001/customerorders/pay?customer=$1&amount=$2"