import axios from "axios";

export default async function handler(req, res) {
  try {
    // Test if the ENS DAO API is still accessible
    const testUrl =
      "https://agora.ensdao.org/api/proposals/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1/votes-csv";

    console.log("Testing ENS DAO API availability...");

    const response = await axios.get(testUrl, {
      timeout: 5000, // 5 second timeout
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SPP-Tracker/1.0)",
      },
    });

    // Check if we got data
    const hasData = response.data && response.data.length > 0;

    res.status(200).json({
      status: "accessible",
      hasData,
      dataLength: response.data ? response.data.length : 0,
      message: hasData
        ? "API is accessible and returning data"
        : "API is accessible but returned no data (vote might be closed)",
    });
  } catch (error) {
    console.error("Error testing API:", error.message);

    res.status(200).json({
      status: "error",
      error: error.message,
      code: error.code,
      statusCode: error.response?.status,
      message: "API appears to be inaccessible or the endpoint has changed",
    });
  }
}
