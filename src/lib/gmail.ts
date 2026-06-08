import { getAccessToken } from './firebase';

export const sendOrderEmail = async (customerEmail: string, orderDetails: any, accessToken: string) => {
  const emailLines = [
    `To: ${customerEmail}`,
    'Subject: Your Order Confirmation - Dryza Spices',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    `<html>`,
    `<body>`,
    `<h2>Thank you for your corporate order!</h2>`,
    `<p>Your inquiry/order <b>${orderDetails.id}</b> has been received and is being processed.</p>`,
    `<p><b>Total Price:</b> ₹${orderDetails.totalPrice}</p>`,
    `<p><b>Products:</b> ${orderDetails.productNames.join(', ')}</p>`,
    `<br>`,
    `<p>Our representative desk will contact you within the 4 Hour Response SLA.</p>`,
    `<p>Best Regards,</p>`,
    `<p>Dryza Spices Team</p>`,
    `</body>`,
    `</html>`
  ];

  const emailRaw = emailLines.join('\r\n');
  
  // Base64Url encode string
  const base64EncodedEmail = window.btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64EncodedEmail }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error('Failed to send email: ' + (errorData.error?.message || response.statusText));
  }
  
  return await response.json();
};
