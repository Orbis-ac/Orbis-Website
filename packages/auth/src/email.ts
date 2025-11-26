import { Resend } from 'resend';

let resendInstance: Resend | null = null;

export const initializeEmail = (apiKey: string) => {
    resendInstance = new Resend(apiKey);
};

const getResend = () => {
    if (!resendInstance) {
        throw new Error('Email service not initialized. Call initializeEmail first.');
    }
    return resendInstance;
};

const emailStyles = `
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 20px;
        text-align: center;
    }
    .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 600;
    }
    .content {
        padding: 40px 30px;
    }
    .content p {
        margin: 0 0 20px;
        font-size: 16px;
        color: #555;
    }
    .button {
        display: inline-block;
        padding: 14px 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        margin: 20px 0;
        transition: transform 0.2s;
    }
    .button:hover {
        transform: translateY(-2px);
    }
    .footer {
        background-color: #f8f9fa;
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
    }
    .footer p {
        margin: 5px 0;
        font-size: 14px;
        color: #6c757d;
    }
    .security-notice {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
    }
    .security-notice p {
        margin: 0;
        font-size: 14px;
        color: #856404;
    }
    .link-box {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
        word-break: break-all;
    }
    .link-box p {
        margin: 5px 0;
        font-size: 13px;
        color: #6c757d;
    }
    .link-box code {
        color: #495057;
        font-size: 12px;
    }
`;

export const sendVerificationEmail = async (email: string, url: string) => {
    const resend = getResend();

    await resend.emails.send({
        from: 'Orbis <no-reply@orbis.place>',
        to: email,
        subject: 'Verify Your Email Address',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email</title>
                <style>${emailStyles}</style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✉️ Verify Your Email</h1>
                    </div>
                    <div class="content">
                        <p>Hi there,</p>
                        <p>Thanks for signing up with Orbis! We're excited to have you on board.</p>
                        <p>To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
                        
                        <div style="text-align: center;">
                            <a href="${url}" class="button">Verify My Email</a>
                        </div>

                        <div class="link-box">
                            <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                            <code>${url}</code>
                        </div>

                        <div class="security-notice">
                            <p><strong>⚠️ Security Notice:</strong> This link will expire in 24 hours. If you didn't create an account with Orbis, please ignore this email.</p>
                        </div>

                        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                        
                        <p>Best regards,<br><strong>The Orbis Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Orbis. All rights reserved.</p>
                        <p>This is an automated message, please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
};

export const sendResetPasswordEmail = async (email: string, url: string) => {
    const resend = getResend();

    await resend.emails.send({
        from: 'Orbis <no-reply@orbis.place>',
        to: email,
        subject: 'Reset Your Password',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>${emailStyles}</style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hi there,</p>
                        <p>We received a request to reset the password for your Orbis account associated with this email address.</p>
                        <p>To reset your password, click the button below:</p>
                        
                        <div style="text-align: center;">
                            <a href="${url}" class="button">Reset My Password</a>
                        </div>

                        <div class="link-box">
                            <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                            <code>${url}</code>
                        </div>

                        <div class="security-notice">
                            <p><strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.</p>
                        </div>

                        <p><strong>Why did I receive this email?</strong><br>
                        This email was sent because someone (hopefully you) requested a password reset for your account. If this wasn't you, your account is still secure and no changes have been made.</p>
                        
                        <p>Best regards,<br><strong>The Orbis Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Orbis. All rights reserved.</p>
                        <p>This is an automated message, please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
};