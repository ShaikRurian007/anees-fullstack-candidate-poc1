# Performance Test Results

## Test Configuration
- **Tool**: k6 v1.3.0
- **Endpoint**: `POST /api/generate-score`
- **Virtual Users**: 10 concurrent users
- **Duration**: 30 seconds
- **Target**: Azure Functions (Flex Consumption Plan)
- **Region**: East US 2

## Results Summary

### ✅ All Thresholds Passed

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **p95 Response Time** | < 500ms | **332.48ms** | ✅ PASS |
| **Failure Rate** | < 5% | **0.00%** | ✅ PASS |
| **Success Rate** | - | **100%** | ✅ |

### Detailed Metrics

#### Response Time Statistics
- **Average**: 285.49ms
- **Minimum**: 209.99ms
- **Median (p50)**: 302.78ms
- **Maximum**: 410.12ms
- **p90**: 319.16ms
- **p95**: 332.48ms ✅

#### Throughput
- **Total Requests**: 380 requests
- **Requests/sec**: 12.36 req/s
- **Total Iterations**: 380 (100% successful)
- **Data Received**: 591 KB (19 KB/s)
- **Data Sent**: 138 KB (4.5 KB/s)

#### Checks
- ✅ **status was 200**: 100% (380/380)
- ✅ **response has overallScore**: 100% (380/380)

## Performance Analysis

### Backend (Azure Functions)
- **p95 latency: 332ms** - Well within the target
- **100% success rate** - No failed requests
- **Consistent performance** - Low variance in response times
- **Cold start impact**: Minimal (all requests served within acceptable limits)

### Frontend Integration
- Target FE interaction < 200ms can be achieved with:
  - Optimistic UI updates
  - Request debouncing
  - Client-side caching
  - Prefetching candidate data

## Recommendations for Production

1. **Enable Application Insights**: Monitor real-world performance
2. **Implement Caching**: Redis for frequently accessed candidate data
3. **CDN**: Use Azure CDN for static frontend assets
4. **Connection Pooling**: Optimize Cosmos DB connections
5. **Warm-up Requests**: Scheduled function to prevent cold starts
6. **Regional Deployment**: Deploy closer to user base

## Test Reproduction

Run the test yourself:

```bash
# Install k6
sudo snap install k6

# Run against production
k6 run workflows/k6/test-generate-score.js

# Run against local
BASE_URL=http://localhost:7071/api k6 run workflows/k6/test-generate-score.js

# Custom test (higher load)
k6 run workflows/k6/test-generate-score.js --vus 50 --duration 60s
```

## Conclusion

The backend API demonstrates **excellent performance** with:
- ✅ Sub-500ms p95 latency (332ms achieved)
- ✅ 100% reliability under load
- ✅ Consistent response times
- ✅ Ready for production deployment

---

**Test Date**: October 27, 2025
**Tested By**: Shaik Mohammed Anees
