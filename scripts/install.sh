#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Install Frontend dependencies
cd frontend
if [ -f package.json ]; then
    npm install
fi
cd ..

echo "Installation complete."
