const fetch = require("node-fetch");

async function testCleanup() {
  try {
    console.log("🔍 Testing card cleanup API...");

    // Test GET request to identify bad cards
    const response = await fetch(
      "http://localhost:3000/api/admin/cards/cleanup",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log(
        `✅ Found ${data.data.totalBadCards} bad cards out of ${data.data.totalCards} total cards`
      );

      // If we found bad cards, run cleanup
      if (data.data.totalBadCards > 0) {
        console.log("\n🧹 Running cleanup...");

        const cleanupResponse = await fetch(
          "http://localhost:3000/api/admin/cards/cleanup",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              confirm: true,
              categories: [], // Empty array means clean all categories
            }),
          }
        );

        const cleanupData = await cleanupResponse.json();
        console.log("Cleanup Response status:", cleanupResponse.status);
        console.log(
          "Cleanup Response data:",
          JSON.stringify(cleanupData, null, 2)
        );

        if (cleanupData.success) {
          console.log(
            `✅ Successfully deleted ${cleanupData.data.totalDeleted} bad cards`
          );
        }
      } else {
        console.log("✅ No bad cards found, cleanup not needed");
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testCleanup();
