const https = require("https");
const http = require("http");

// Test configuration
const BASE_URL = process.env.VERCEL_URL || "http://localhost:3000";
const TEST_ENDPOINTS = [
  {
    name: "Profile API",
    path: "/api/users/profile",
    method: "GET",
    expectedStatus: [200, 401], // 401 is OK if not authenticated
  },
  {
    name: "Learning Activities List",
    path: "/api/learning-activities",
    method: "GET",
    expectedStatus: [200],
  },
  {
    name: "Learning Activities Complete",
    path: "/api/learning-activities/complete",
    method: "POST",
    expectedStatus: [401, 400], // 401 if not authenticated, 400 if missing data
    body: JSON.stringify({
      activityType: "test",
      activityId: "test-id",
      score: 100,
      diamondReward: 10,
      experienceReward: 50,
    }),
  },
];

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    const req = protocol.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testEndpoint(endpoint) {
  console.log(`\n🧪 Testing: ${endpoint.name}`);
  console.log(`📍 ${endpoint.method} ${endpoint.path}`);

  try {
    const url = `${BASE_URL}${endpoint.path}`;
    const options = {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "API-Test-Script/1.0",
      },
    };

    if (endpoint.body) {
      options.body = endpoint.body;
    }

    const response = await makeRequest(url, options);

    const isExpectedStatus = endpoint.expectedStatus.includes(
      response.statusCode
    );
    const statusSymbol = isExpectedStatus ? "✅" : "❌";

    console.log(`${statusSymbol} Status: ${response.statusCode}`);

    if (response.body) {
      try {
        const jsonBody = JSON.parse(response.body);
        console.log(
          `📦 Response: ${JSON.stringify(jsonBody, null, 2).substring(0, 200)}...`
        );
      } catch (e) {
        console.log(`📦 Response: ${response.body.substring(0, 100)}...`);
      }
    }

    return {
      endpoint: endpoint.name,
      success: isExpectedStatus,
      statusCode: response.statusCode,
      expectedStatus: endpoint.expectedStatus,
    };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return {
      endpoint: endpoint.name,
      success: false,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log("🚀 Starting API endpoint tests...");
  console.log(`🌐 Base URL: ${BASE_URL}`);

  const results = [];

  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }

  console.log("\n📊 Test Results Summary:");
  console.log("=" * 50);

  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  results.forEach((result) => {
    const symbol = result.success ? "✅" : "❌";
    console.log(`${symbol} ${result.endpoint}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    } else if (!result.success) {
      console.log(
        `   Expected: ${result.expectedStatus}, Got: ${result.statusCode}`
      );
    }
  });

  console.log(`\n🎯 Summary: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All API endpoints are responding correctly!");
    process.exit(0);
  } else {
    console.log("⚠️ Some endpoints need attention");
    process.exit(1);
  }
}

// Add a specific test for learning activity by ID
async function testDynamicEndpoint() {
  console.log("\n🔍 Testing dynamic endpoint with sample ID...");

  // First, try to get a list to find a real ID
  try {
    const listResponse = await makeRequest(
      `${BASE_URL}/api/learning-activities`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (listResponse.statusCode === 200) {
      const data = JSON.parse(listResponse.body);
      if (data.activities && data.activities.length > 0) {
        const testId = data.activities[0].id;
        console.log(`📋 Found sample activity ID: ${testId}`);

        const idResponse = await makeRequest(
          `${BASE_URL}/api/learning-activities/${testId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const symbol = idResponse.statusCode === 200 ? "✅" : "❌";
        console.log(
          `${symbol} Learning Activity by ID: ${idResponse.statusCode}`
        );
      }
    }
  } catch (error) {
    console.log(`❌ Dynamic endpoint test failed: ${error.message}`);
  }
}

// Run tests
runTests().then(() => {
  return testDynamicEndpoint();
});
