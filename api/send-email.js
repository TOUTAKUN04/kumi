export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userChoice, munchCredits, ip, deviceInfo } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Valentine Card <onboarding@resend.dev>',
        to: process.env.EMAIL_TO,
        subject: `Valentine Response: ${userChoice.toUpperCase()}`,
        html: `
          <h2>Moni Responded!</h2>
          <p><strong>Decision:</strong> ${userChoice}</p>
          <p><strong>Total Munch Points:</strong> ${munchCredits}</p>
          <hr>
          <p><strong>IP:</strong> ${ip}</p>
          <p><strong>Device:</strong> ${deviceInfo}</p>
        `
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}