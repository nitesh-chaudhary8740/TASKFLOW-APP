const mailData = (fullName,userName, password) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TaskFlow!</title>
    <style>
        /* Ensures body and container are responsive and background is clean */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .header {
            background-color: #5741FF; /* TaskFlow Brand Color */
            color: #ffffff;
            padding: 25px 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
            line-height: 1.6;
        }
        .credentials-box {
            background-color: #eef2ff;
            border-left: 5px solid #5741FF;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .credential-item {
            margin-bottom: 10px;
            font-size: 16px;
        }
        .credential-item strong {
            display: inline-block;
            width: 100px;
            color: #333;
        }
        .footer {
            text-align: center;
            padding: 20px 30px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eeeeee;
        }
        .cta-button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 25px;
            background-color: #5741FF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">TaskFlow</h1>
        </div>
        <div class="content">
            <h2 style="font-size: 24px; color: #5741FF; margin-top: 0;">Welcome Aboard, ${fullName}!</h2>
            
            <p style="font-size: 16px;">
                We are thrilled to have you join the TaskFlow community. Your account has been successfully created.
                You can now log in using the credentials below to start managing your projects and tasks effortlessly.
            </p>

            <div class="credentials-box">
                <p style="margin-top: 0; font-weight: bold; color: #5741FF;">Your Temporary Login Details:</p>
                <div class="credential-item">
                    <strong>Username:</strong> <span style="font-weight: bold; color: #333;">${userName}</span>
                </div>
                <div class="credential-item">
                    <strong>Password:</strong> <span style="font-weight: bold; color: #cc0000;">${password}</span>
                </div>
            </div>

            <p style="text-align: center;">
                <a href="[YOUR_LOGIN_URL_HERE]" class="cta-button">
                    Access My TaskFlow Account
                </a>
            </p>
            
            <p style="font-size: 14px; color: #777;">
                **Security Note:** For your protection, please change your password immediately after your first successful login.
            </p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
    </div>
</body>
</html>`
module.exports =mailData;