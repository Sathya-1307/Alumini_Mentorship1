// services/reminderService.js
const cron = require('node-cron');
const MeetingSchedule = require('../models/MeetingSchedule');
const User = require('../models/User');
const { sendReminderEmail } = require('./emailService');

// Check for upcoming meetings and send reminders
exports.checkAndSendReminders = async () => {
  try {
    console.log('🕒 Checking for upcoming meetings to send reminders...');
    
    const now = new Date();
    
    // Get all meetings with future dates - NO POPULATE
    const meetings = await MeetingSchedule.find({
      'meeting_dates.date': { $gt: now }
    });

    console.log(`📋 Found ${meetings.length} meetings with future dates`);
    
    let remindersSent = 0;
    
    for (const meeting of meetings) {
      for (const dateEntry of meeting.meeting_dates) {
        const meetingDate = new Date(dateEntry.date);
        
        // Skip if meeting is in the past
        if (meetingDate <= now) continue;
        
        // Calculate days until meeting
        const daysUntilMeeting = Math.ceil((meetingDate - now) / (1000 * 60 * 60 * 24));
        
        console.log(`📅 Meeting on ${meetingDate.toDateString()} is ${daysUntilMeeting} days away`);
        
        // Check for 7 days (1 week) reminder
        if (daysUntilMeeting === 7) {
          console.log(`📧 Sending 1-week reminder for meeting on ${meetingDate.toDateString()}`);
          const sent = await sendMeetingReminders(meeting, dateEntry, '1_week_before');
          if (sent) remindersSent++;
        }
        
        // Check for 3 days reminder
        if (daysUntilMeeting === 3) {
          console.log(`📧 Sending 3-day reminder for meeting on ${meetingDate.toDateString()}`);
          const sent = await sendMeetingReminders(meeting, dateEntry, '3_days_before');
          if (sent) remindersSent++;
        }
      }
    }
    
    console.log(`✅ Sent ${remindersSent} reminder(s) for upcoming meetings`);
    return remindersSent;
    
  } catch (error) {
    console.error('❌ Error checking and sending reminders:', error);
    return 0;
  }
};

// Send reminders for a specific meeting
const sendMeetingReminders = async (meeting, dateEntry, reminderType) => {
  try {
    // Get mentor manually - NO POPULATE
    const mentor = await User.findById(meeting.mentor_user_id);
    
    if (!mentor || !mentor.basic?.email_id) {
      console.log(`❌ Mentor not found or has no email for meeting ${meeting._id}`);
      return false;
    }
    
    // Get all mentees manually - NO POPULATE
    const menteePromises = meeting.mentee_user_ids.map(menteeId => 
      User.findById(menteeId)
    );
    const mentees = await Promise.all(menteePromises);
    const validMentees = mentees.filter(m => m && m.basic?.email_id);
    
    if (validMentees.length === 0) {
      console.log(`❌ No valid mentees found for meeting ${meeting._id}`);
      return false;
    }
    
    // Prepare meeting details
    const meetingDetails = {
      meeting_date: dateEntry.date,
      meeting_time: meeting.meeting_time,
      mentor_name: mentor.basic?.name || 'Mentor',
      mentee_name: validMentees.length > 0 ? validMentees[0]?.basic?.name || 'Mentee' : 'Mentee',
      agenda: meeting.agenda || 'Mentorship session',
      platform: meeting.platform || 'Online',
      meeting_link: meeting.meeting_link || '',
      days_until: reminderType === '1_week_before' ? 7 : 3
    };
    
    let emailsSent = 0;
    
    // Send to mentor
    console.log(`📨 Sending ${reminderType} to mentor: ${mentor.basic.email_id}`);
    const mentorEmailSent = await sendReminderEmail(
      mentor.basic.email_id,
      mentor.basic?.name || 'Mentor',
      meetingDetails,
      reminderType
    );
    
    if (mentorEmailSent) {
      emailsSent++;
      console.log(`✅ Mentor email sent to ${mentor.basic.email_id}`);
    }
    
    // Send to all mentees
    for (const mentee of validMentees) {
      console.log(`📨 Sending ${reminderType} to mentee: ${mentee.basic.email_id}`);
      
      const menteeEmailSent = await sendReminderEmail(
        mentee.basic.email_id,
        mentee.basic?.name || 'Mentee',
        {
          ...meetingDetails,
          mentee_name: mentee.basic?.name || 'Mentee'
        },
        reminderType
      );
      
      if (menteeEmailSent) {
        emailsSent++;
        console.log(`✅ Mentee email sent to ${mentee.basic.email_id}`);
      }
    }
    
    console.log(`✅ ${reminderType} reminders sent for meeting - Total: ${emailsSent} emails`);
    return emailsSent > 0;
    
  } catch (error) {
    console.error(`❌ Error sending ${reminderType} reminders:`, error);
    return false;
  }
};

// Setup daily cron job to check for reminders
exports.setupReminderScheduler = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Daily reminder check running at', new Date().toISOString());
    await exports.checkAndSendReminders();
  });
  
  console.log('✅ Reminder scheduler set up (runs daily at 9:00 AM)');
};

// Manual trigger for testing
exports.triggerRemindersNow = async () => {
  console.log('🚀 Manually triggering reminders at', new Date().toISOString());
  return await exports.checkAndSendReminders();
};

// Debug function to check what meetings would trigger reminders
exports.debugReminderLogic = async () => {
  try {
    const now = new Date();
    console.log('🔍 Debugging reminder logic...');
    console.log('Current time:', now.toISOString());
    
    // Calculate dates for 7 and 3 days from now
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    sevenDaysLater.setHours(0, 0, 0, 0);
    
    const eightDaysLater = new Date(sevenDaysLater);
    eightDaysLater.setDate(eightDaysLater.getDate() + 1);
    
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    threeDaysLater.setHours(0, 0, 0, 0);
    
    const fourDaysLater = new Date(threeDaysLater);
    fourDaysLater.setDate(fourDaysLater.getDate() + 1);
    
    console.log('Looking for meetings on:');
    console.log('- 7 days from now:', sevenDaysLater.toDateString());
    console.log('- 3 days from now:', threeDaysLater.toDateString());
    
    // Find meetings
    const meetings7Days = await MeetingSchedule.find({
      'meeting_dates.date': {
        $gte: sevenDaysLater,
        $lt: eightDaysLater
      }
    });
    
    const meetings3Days = await MeetingSchedule.find({
      'meeting_dates.date': {
        $gte: threeDaysLater,
        $lt: fourDaysLater
      }
    });
    
    console.log(`\n📊 Results:`);
    console.log(`- Meetings 7 days away: ${meetings7Days.length}`);
    console.log(`- Meetings 3 days away: ${meetings3Days.length}`);
    
    // Get details for meetings 7 days away
    if (meetings7Days.length > 0) {
      console.log('\n📅 Meetings 7 days away:');
      for (const meeting of meetings7Days) {
        const mentor = await User.findById(meeting.mentor_user_id);
        console.log(`  - Meeting ID: ${meeting._id}`);
        console.log(`    Mentor: ${mentor?.basic?.name || 'Unknown'} (${mentor?.basic?.email_id || 'No email'})`);
        console.log(`    Dates: ${meeting.meeting_dates.map(d => new Date(d.date).toDateString()).join(', ')}`);
      }
    }
    
    // Get details for meetings 3 days away
    if (meetings3Days.length > 0) {
      console.log('\n📅 Meetings 3 days away:');
      for (const meeting of meetings3Days) {
        const mentor = await User.findById(meeting.mentor_user_id);
        console.log(`  - Meeting ID: ${meeting._id}`);
        console.log(`    Mentor: ${mentor?.basic?.name || 'Unknown'} (${mentor?.basic?.email_id || 'No email'})`);
        console.log(`    Dates: ${meeting.meeting_dates.map(d => new Date(d.date).toDateString()).join(', ')}`);
      }
    }
    
    if (meetings7Days.length === 0 && meetings3Days.length === 0) {
      console.log('\n⚠️ No meetings found for reminder triggers.');
      console.log('   Create meetings with dates exactly 7 or 3 days from now to test.');
    }
    
    return {
      now: now,
      sevenDaysLater: sevenDaysLater,
      threeDaysLater: threeDaysLater,
      meetings7Days: meetings7Days.length,
      meetings3Days: meetings3Days.length
    };
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return null;
  }
};