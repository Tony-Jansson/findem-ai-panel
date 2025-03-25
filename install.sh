#!/bin/bash

# Install system dependencies
sudo yum install -y python3.9 python3.9-devel nodejs npm ffmpeg

# Create virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..

echo "Installation complete!"
echo "1. Configure .env file"
echo "2. Start server with: ./start.sh"
