// services/emailService.js
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send reminder email
exports.sendReminderEmail = async (to, userName, meetingDetails, reminderType) => {
  try {
    const { meeting_date, meeting_time, mentor_name, mentee_name, agenda, platform, meeting_link } = meetingDetails;
    
    // Format date
    const meetingDate = new Date(meeting_date);
    const formattedDate = meetingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create email content based on reminder type
    let subject = '';
    let timeText = '';
    
    if (reminderType === '1_week_before') {
      subject = `📅 Mentorship Meeting Reminder (1 Week Before) - ${formattedDate}`;
      timeText = 'in 1 week';
    } else if (reminderType === '3_days_before') {
      subject = `⏰ Mentorship Meeting Reminder (3 Days Before) - ${formattedDate}`;
      timeText = 'in 3 days';
    }
    
    const emailContent = createEmailTemplate(userName, timeText, formattedDate, meeting_time, mentor_name, mentee_name, agenda, platform, meeting_link);
    
    const mailOptions = {
      from: `"Mentorship Program" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: emailContent
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${to}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return false;
  }
};

// Create HTML email template
const createEmailTemplate = (userName, timeText, date, time, mentorName, menteeName, agenda, platform, meetingLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Mentorship Meeting Reminder</h1>
          <p>Meeting ${timeText}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>This is a reminder about your upcoming mentorship meeting ${timeText}.</p>
          
          <div class="details">
            <h3>Meeting Details:</h3>
            <p><strong>📅 Date:</strong> ${date}</p>
            <p><strong>⏰ Time:</strong> ${time}</p>
            <p><strong>👨‍🏫 Mentor:</strong> ${mentorName}</p>
            <p><strong>👨‍🎓 Mentee:</strong> ${menteeName}</p>
            <p><strong>📝 Agenda:</strong> ${agenda || 'General mentorship discussion'}</p>
            <p><strong>💻 Platform:</strong> ${platform}</p>
            ${meetingLink ? `<p><strong>🔗 Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
          </div>
          
          ${meetingLink ? `
            <a href="${meetingLink}" class="button">Join Meeting</a>
          ` : ''}
          
          <p>Best regards,<br>Mentorship Program Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated reminder. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Alumni Mentorship Program</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Test email configuration
exports.testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error);
    return false;
  }
};