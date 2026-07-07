const AT_USERNAME = process.env.AT_USERNAME;
const AT_API_KEY = process.env.AT_API_KEY;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!AT_USERNAME || !AT_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Africa's Talking credentials not configured. Set AT_USERNAME and AT_API_KEY in Netlify environment variables.",
      }),
    };
  }

  try {
    const { phone, code } = JSON.parse(event.body);

    if (!phone || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Phone and code are required" }),
      };
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const message = `Your Tanda Africa verification code is: ${code}. It expires in 10 minutes.`;

    const params = new URLSearchParams({
      username: AT_USERNAME,
      to: cleanPhone,
      message,
    });

    const response = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        apiKey: AT_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });

    const result = await response.json();

    if (response.ok && result.SMSMessageData?.Recipients?.[0]?.status === "Success") {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "SMS sent successfully" }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: result.SMSMessageData?.Message || "Failed to send SMS",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
}
