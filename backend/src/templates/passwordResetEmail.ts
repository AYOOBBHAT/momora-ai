const BRAND_GREEN = '#013E37';
const BRAND_BUTTER = '#FFEFB3';
const BRAND_MUTED = '#B9C6BE';

export function buildPasswordResetEmailHtml(otp: string, expiresMinutes: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Memora password reset</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND_GREEN};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND_GREEN};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#0A4A43;border-radius:20px;border:1px solid rgba(255,239,179,0.12);overflow:hidden;">
          <tr>
            <td style="padding:32px 28px 8px;text-align:center;">
              <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background:${BRAND_GREEN};border:1px solid rgba(255,239,179,0.2);line-height:48px;font-size:22px;font-weight:700;color:${BRAND_BUTTER};">M</div>
              <p style="margin:12px 0 0;font-size:20px;font-weight:700;color:${BRAND_BUTTER};letter-spacing:-0.3px;">Memora</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:600;color:${BRAND_BUTTER};line-height:1.35;">Your password reset code</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;text-align:center;">
              <div style="display:inline-block;padding:16px 28px;border-radius:14px;background:${BRAND_GREEN};border:1px solid rgba(255,239,179,0.18);">
                <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:${BRAND_BUTTER};font-variant-numeric:tabular-nums;">${otp}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;text-align:center;">
              <p style="margin:0;font-size:14px;line-height:1.5;color:${BRAND_MUTED};">Valid for ${expiresMinutes} minutes.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 32px;text-align:center;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:${BRAND_MUTED};">
                If you didn't request this, you can safely ignore this email.
                Your password will not change unless you enter this code in the app.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildPasswordResetEmailText(otp: string, expiresMinutes: number): string {
  return `Memora — Your password reset code

${otp}

Valid for ${expiresMinutes} minutes.

If you didn't request this, you can safely ignore this email.`;
}
