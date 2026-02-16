#!/bin/bash

# Gemini AI Integration Setup Script
# This script helps you set up the Gemini AI integration for the backend

echo "==================================="
echo "Gemini AI Integration Setup"
echo "==================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env file..."
    echo "GEMINI_API_KEY=" > .env
    echo "✅ .env file created"
else
    echo "✅ .env file found"
fi

echo ""
echo "Step 1: Get your Gemini API Key"
echo "================================"
echo "1. Go to: https://makersuite.google.com/app/apikey"
echo "2. Click 'Create API key'"
echo "3. Copy the API key"
echo ""

read -p "Enter your Gemini API Key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ API key is empty. Please try again."
    exit 1
fi

# Update .env file
if grep -q "GEMINI_API_KEY=" .env; then
    # macOS compatible sed
    sed -i '' "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$api_key/" .env
else
    echo "GEMINI_API_KEY=$api_key" >> .env
fi

echo "✅ API key added to .env"
echo ""

echo "Step 2: Install Dependencies"
echo "============================="
npm install

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Start the server: npm run dev (or npm start for production)"
echo "2. Test the AI endpoints with Postman or curl"
echo ""
echo "Available endpoints:"
echo "  POST /api/ai/doubt-hint       - Get hint for a doubt"
echo "  POST /api/ai/doubt-answer     - Get comprehensive answer to doubt"
echo "  POST /api/ai/tags             - Generate tags from text"
echo "  POST /api/ai/blog-summary     - Summarize blog content"
echo ""
echo "See GEMINI_INTEGRATION.md for more details."
