// API endpoint to fetch votes data from ENS DAO
import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "https://agora.ensdao.org/api/proposals/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1/votes-csv"
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ error: "Failed to fetch votes data" });
  }
}
