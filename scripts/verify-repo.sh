#!/usr/bin/env bash
# Project-Auctus Health Check Script
# Runs all verification steps: tests, build, type-check, audit, lint

set -e

echo "🔍 Project-Auctus Health Check"
echo "================================"

echo ""
echo "📦 Running test suite..."
npm test

echo ""
echo "🏗️  Building production bundle..."
npm run build

echo ""
echo "📝 Type checking..."
npm run type-check

echo ""
echo "🔒 Security audit..."
npm audit --production

echo ""
echo "🎯 Linting..."
npm run lint

echo ""
echo "✅ All checks passed! Repository is healthy."