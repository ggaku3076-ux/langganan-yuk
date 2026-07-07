export async function sendWhatsApp(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn("[FONNTE] Fonnte Token is not set in environment variables (FONNTE_TOKEN).");
    return false;
  }

  // Format number to international code if it starts with 0
  let formattedTarget = target.trim();
  if (formattedTarget.startsWith("0")) {
    formattedTarget = "62" + formattedTarget.slice(1);
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        target: formattedTarget,
        message: message
      })
    });

    const resData = await response.json();
    console.log("[FONNTE RESULT]", resData);
    return resData.status === true;
  } catch (error) {
    console.error("[FONNTE ERROR]", error);
    return false;
  }
}
