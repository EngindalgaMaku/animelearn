const fetch = require("node-fetch");

async function testAPI() {
  try {
    console.log("Testing /api/upload endpoint...\n");

    // Test the same endpoint admin panel uses
    const response = await fetch(
      "http://localhost:3002/api/upload?page=1&limit=10"
    );

    if (!response.ok) {
      console.log("API Response not OK:", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    console.log("API Response:");
    console.log("Total cards:", data.pagination?.totalCards || 0);
    console.log("Cards in response:", data.cards?.length || 0);

    if (data.cards && data.cards.length > 0) {
      console.log("\nRecent cards from API:");
      data.cards.slice(0, 5).forEach((card, index) => {
        console.log(
          `${index + 1}. ${card.cardTitle || card.name || "Unnamed"}`
        );
        console.log(`   File: ${card.fileName}`);
        console.log(`   Date: ${card.uploadDate}`);
        console.log(`   Analyzed: ${card.isAnalyzed}`);
        console.log("");
      });
    } else {
      console.log("No cards found in API response");
    }
  } catch (error) {
    console.error("Error testing API:", error.message);
  }
}

testAPI();
