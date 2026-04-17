#!/bin/bash
set -e

./mvnw clean package -DskipTests

fly deploy --ha=false
