// controllers/reminderController.js
const { checkAndSendReminders, triggerRemindersNow } = require('../services/reminderService');
const MeetingSchedule = require('../models/MeetingSchedule');
const User = require('../models/User');

// Manually trigger reminders (for testing)
exports.triggerReminders = async (req, res) => {
  try {
    console.log('🚀 Manually triggering reminder check...');
    const remindersSent = await triggerRemindersNow();
    
    res.json({
      success: true,
      message: `Reminders triggered successfully`,
      remindersSent: remindersSent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error triggering reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger reminders',
      error: error.message
    });
  }
};

// Health check endpoint
exports.healthCheck = async (req, res) => {
  try {
    // Test email configuration
    const { testEmailConfig } = require('../services/emailService');
    const emailStatus = await testEmailConfig();
    
    res.json({
      status: 'healthy',
      message: 'Reminder service is running',
      timestamp: new Date().toISOString(),
      schedule: 'Daily at 9:00 AM',
      reminders: '1 week before & 3 days before meetings',
      email_service: emailStatus ? 'configured' : 'not configured',
      next_check: 'Tomorrow at 9:00 AM'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Reminder service health check failed',
      error: error.message
    });
  }
};

// Get upcoming reminders for a specific user
exports.getUserReminders = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }
    
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Find user
    const user = await User.findOne({ 
      'basic.email_id': { $regex: new RegExp(`^${email.trim().toLowerCase()}$`, "i") }
    });
    
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      return res.status(404).json({
        success: false,
        message: 'User not found',
        searched_email: email
      });
    }
    
    console.log(`✅ Found user: ${user.basic?.name || 'Unknown'}`);
    
    // Find meetings where user is either mentor or mentee
    const meetings = await MeetingSchedule.find({
      $or: [
        { mentor_user_id: user._id },
        { mentee_user_ids: user._id }
      ],
      'meeting_dates.date': { $gt: new Date() }
    });

    console.log(`📅 Found ${meetings.length} upcoming meetings for user`);
    
    // Format reminders
    const reminders = [];
    const now = new Date();
    
    for (const meeting of meetings) {
      for (const dateEntry of meeting.meeting_dates) {
        const meetingDate = new Date(dateEntry.date);
        
        if (meetingDate > now) {
          const daysUntilMeeting = Math.ceil((meetingDate - now) / (1000 * 60 * 60 * 24));
          
          // Get user role in this meeting
          const isMentor = meeting.mentor_user_id.toString() === user._id.toString();
          const role = isMentor ? 'mentor' : 'mentee';
          
          // Get other participants
          let otherParticipants = [];
          
          if (isMentor) {
            // If user is mentor, get mentees info
            const mentees = await User.find({
              _id: { $in: meeting.mentee_user_ids }
            }).select('basic.name basic.email_id');
            
            otherParticipants = mentees.map(m => ({
              name: m.basic?.name || 'Mentee',
              email: m.basic?.email_id || '',
              role: 'mentee'
            }));
          } else {
            // If user is mentee, get mentor info
            const mentor = await User.findById(meeting.mentor_user_id).select('basic.name basic.email_id');
            if (mentor) {
              otherParticipants.push({
                name: mentor.basic?.name || 'Mentor',
                email: mentor.basic?.email_id || '',
                role: 'mentor'
              });
            }
            
            // Get other mentees (excluding current user)
            const otherMentees = await User.find({
              _id: { 
                $in: meeting.mentee_user_ids.filter(id => id.toString() !== user._id.toString()) 
              }
            }).select('basic.name basic.email_id');
            
            otherParticipants = otherParticipants.concat(
              otherMentees.map(m => ({
                name: m.basic?.name || 'Mentee',
                email: m.basic?.email_id || '',
                role: 'mentee'
              }))
            );
          }
          
          reminders.push({
            meeting_id: dateEntry.meeting_id,
            date: meetingDate.toISOString().split('T')[0],
            formatted_date: meetingDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            time: meeting.meeting_time,
            formatted_time: formatTime(meeting.meeting_time),
            agenda: meeting.agenda || 'Mentorship session',
            platform: meeting.platform,
            meeting_link: meeting.meeting_link,
            your_role: role,
            other_participants: otherParticipants,
            days_until: daysUntilMeeting,
            reminder_status: getReminderStatus(daysUntilMeeting)
          });
        }
      }
    }
    
    // Sort by date (soonest first)
    reminders.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      user: {
        name: user.basic?.name || 'Unknown',
        email: user.basic?.email_id || email,
        user_id: user._id
      },
      upcoming_reminders: reminders,
      total_reminders: reminders.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error getting user reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user reminders',
      error: error.message
    });
  }
};

// Helper function to format time
function formatTime(timeString) {
  if (!timeString) return 'Time not set';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  
  if (isNaN(hour)) {
    return timeString;
  }
  
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinutes = minutes || '00';
  
  return `${displayHour}:${displayMinutes} ${ampm}`;
}

// Helper function to determine reminder status
function getReminderStatus(daysUntilMeeting) {
  if (daysUntilMeeting > 7) {
    return {
      status: 'upcoming',
      next_reminder: `1 week reminder in ${daysUntilMeeting - 7} days`,
      reminder_type: '1_week_before',
      days_to_reminder: daysUntilMeeting - 7
    };
  } else if (daysUntilMeeting === 7) {
    return {
      status: 'reminder_due_today',
      next_reminder: '1 week reminder should be sent today',
      reminder_type: '1_week_before',
      days_to_reminder: 0
    };
  } else if (daysUntilMeeting > 3 && daysUntilMeeting < 7) {
    return {
      status: 'between_reminders',
      next_reminder: `3 day reminder in ${daysUntilMeeting - 3} days`,
      reminder_type: '3_days_before',
      days_to_reminder: daysUntilMeeting - 3
    };
  } else if (daysUntilMeeting === 3) {
    return {
      status: 'reminder_due_today',
      next_reminder: '3 day reminder should be sent today',
      reminder_type: '3_days_before',
      days_to_reminder: 0
    };
  } else if (daysUntilMeeting < 3 && daysUntilMeeting > 0) {
    return {
      status: 'meeting_soon',
      next_reminder: 'Meeting is soon - all reminders sent',
      reminder_type: 'none',
      days_to_reminder: null
    };
  } else if (daysUntilMeeting === 0) {
    return {
      status: 'meeting_today',
      next_reminder: 'Meeting is today!',
      reminder_type: 'none',
      days_to_reminder: null
    };
  }
  
  return {
    status: 'unknown',
    next_reminder: 'No reminder scheduled',
    reminder_type: 'none',
    days_to_reminder: null
  };
}

// Test email sending (for debugging)
exports.testEmail = async (req, res) => {
  try {
    const { to, name } = req.body;
    
    if (!to || !name) {
      return res.status(400).json({
        success: false,
        message: 'Both "to" (email) and "name" are required'
      });
    }
    
    const { sendReminderEmail } = require('../services/emailService');
    
    // Create test meeting details
    const testMeetingDetails = {
      meeting_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      meeting_time: '14:30',
      mentor_name: 'Test Mentor',
      mentee_name: name,
      agenda: 'Test mentorship meeting',
      platform: 'Zoom',
      meeting_link: 'https://zoom.us/test-meeting'
    };
    
    // Send test email
    const emailSent = await sendReminderEmail(
      to,
      name,
      testMeetingDetails,
      '1_week_before'
    );
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        recipient: to,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email'
      });
    }
    
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
};

// Get all upcoming meetings (admin view)
exports.getAllUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    
    // Get all meetings with future dates
    const meetings = await MeetingSchedule.find({
      'meeting_dates.date': { $gt: now }
    });

    console.log(`📊 Found ${meetings.length} meetings with future dates`);
    
    // Format response
    const formattedMeetings = [];
    
    for (const meeting of meetings) {
      // Get mentor info
      const mentor = await User.findById(meeting.mentor_user_id).select('basic.name basic.email_id');
      
      // Get all mentees info
      const mentees = await User.find({
        _id: { $in: meeting.mentee_user_ids }
      }).select('basic.name basic.email_id');
      
      // Process each future date
      for (const dateEntry of meeting.meeting_dates) {
        const meetingDate = new Date(dateEntry.date);
        
        if (meetingDate > now) {
          const daysUntilMeeting = Math.ceil((meetingDate - now) / (1000 * 60 * 60 * 24));
          
          formattedMeetings.push({
            meeting_id: dateEntry.meeting_id,
            schedule_id: meeting._id,
            date: meetingDate.toISOString().split('T')[0],
            formatted_date: meetingDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            time: meeting.meeting_time,
            formatted_time: formatTime(meeting.meeting_time),
            agenda: meeting.agenda || 'Mentorship session',
            platform: meeting.platform,
            meeting_link: meeting.meeting_link,
            mentor: {
              name: mentor?.basic?.name || 'Mentor',
              email: mentor?.basic?.email_id || 'Unknown'
            },
            mentees: mentees.map(mentee => ({
              name: mentee.basic?.name || 'Mentee',
              email: mentee.basic?.email_id || 'Unknown'
            })),
            days_until: daysUntilMeeting,
            reminder_status: getReminderStatus(daysUntilMeeting),
            total_participants: 1 + mentees.length
          });
        }
      }
    }
    
    // Count reminders by status
    const reminderStats = {
      total_upcoming: formattedMeetings.length,
      one_week_reminders: formattedMeetings.filter(m => m.days_until === 7).length,
      three_day_reminders: formattedMeetings.filter(m => m.days_until === 3).length,
      meetings_today: formattedMeetings.filter(m => m.days_until === 0).length,
      meetings_this_week: formattedMeetings.filter(m => m.days_until <= 7).length
    };
    
    res.json({
      success: true,
      stats: reminderStats,
      upcoming_meetings: formattedMeetings,
      total_meetings: formattedMeetings.length,
      timestamp: new Date().toISOString(),
      next_daily_check: 'Tomorrow at 9:00 AM'
    });
    
  } catch (error) {
    console.error('❌ Error getting all upcoming reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upcoming reminders',
      error: error.message
    });
  }
};

// Check specific meeting reminder status
exports.getMeetingReminderStatus = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: 'Meeting ID is required'
      });
    }
    
    const meeting = await MeetingSchedule.findOne({
      'meeting_dates.meeting_id': meetingId
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    // Find the specific date entry
    const dateEntry = meeting.meeting_dates.find(d => 
      d.meeting_id && d.meeting_id.toString() === meetingId
    );
    
    if (!dateEntry) {
      return res.status(404).json({
        success: false,
        message: 'Meeting date not found'
      });
    }
    
    // Get mentor info
    const mentor = await User.findById(meeting.mentor_user_id).select('basic.name basic.email_id');
    
    // Get mentees info
    const mentees = await User.find({
      _id: { $in: meeting.mentee_user_ids }
    }).select('basic.name basic.email_id');
    
    const now = new Date();
    const meetingDate = new Date(dateEntry.date);
    const daysUntilMeeting = Math.ceil((meetingDate - now) / (1000 * 60 * 60 * 24));
    
    const response = {
      success: true,
      meeting: {
        meeting_id: meetingId,
        date: meetingDate.toISOString().split('T')[0],
        formatted_date: meetingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: meeting.meeting_time,
        formatted_time: formatTime(meeting.meeting_time),
        agenda: meeting.agenda || 'Mentorship session',
        platform: meeting.platform,
        meeting_link: meeting.meeting_link,
        mentor: {
          name: mentor?.basic?.name || 'Mentor',
          email: mentor?.basic?.email_id || 'Unknown'
        },
        mentees: mentees.map(mentee => ({
          name: mentee.basic?.name || 'Mentee',
          email: mentee.basic?.email_id || 'Unknown'
        }))
      },
      reminder_info: {
        days_until: daysUntilMeeting,
        status: getReminderStatus(daysUntilMeeting),
        next_check: 'Daily at 9:00 AM',
        will_send_reminder: daysUntilMeeting === 7 || daysUntilMeeting === 3
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Error getting meeting reminder status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get meeting reminder status',
      error: error.message
    });
  }
};

// Get reminders count for dashboard
exports.getRemindersCount = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = await User.findOne({ 
      'basic.email_id': { $regex: new RegExp(`^${email.trim().toLowerCase()}$`, "i") }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const now = new Date();
    
    // Get meetings where user is involved
    const meetings = await MeetingSchedule.find({
      $or: [
        { mentor_user_id: user._id },
        { mentee_user_ids: user._id }
      ],
      'meeting_dates.date': { $gt: now }
    });
    
    // Count meetings by timeframe
    let upcomingToday = 0;
    let upcomingThisWeek = 0;
    let upcomingNextWeek = 0;
    let upcomingLater = 0;
    
    for (const meeting of meetings) {
      for (const dateEntry of meeting.meeting_dates) {
        const meetingDate = new Date(dateEntry.date);
        
        if (meetingDate > now) {
          const daysUntilMeeting = Math.ceil((meetingDate - now) / (1000 * 60 * 60 * 24));
          
          if (daysUntilMeeting === 0) {
            upcomingToday++;
          } else if (daysUntilMeeting <= 7) {
            upcomingThisWeek++;
          } else if (daysUntilMeeting <= 14) {
            upcomingNextWeek++;
          } else {
            upcomingLater++;
          }
        }
      }
    }
    
    res.json({
      success: true,
      user: {
        name: user.basic?.name || 'User',
        email: user.basic?.email_id
      },
      counts: {
        upcoming_today: upcomingToday,
        upcoming_this_week: upcomingThisWeek,
        upcoming_next_week: upcomingNextWeek,
        upcoming_later: upcomingLater,
        total_upcoming: upcomingToday + upcomingThisWeek + upcomingNextWeek + upcomingLater
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error getting reminders count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reminders count',
      error: error.message
    });
  }
};

// Clear old reminders (cleanup)
exports.clearOldReminders = async (req, res) => {
  try {
    const now = new Date();
    
    // Find all meetings with dates in the past
    const meetings = await MeetingSchedule.find({
      'meeting_dates.date': { $lt: now }
    });
    
    let pastMeetingsRemoved = 0;
    
    for (const meeting of meetings) {
      // Remove past dates from each meeting
      const updatedDates = meeting.meeting_dates.filter(dateEntry => 
        new Date(dateEntry.date) >= now
      );
      
      if (updatedDates.length !== meeting.meeting_dates.length) {
        pastMeetingsRemoved += (meeting.meeting_dates.length - updatedDates.length);
        
        if (updatedDates.length === 0) {
          // If no future dates, delete the entire meeting
          await MeetingSchedule.findByIdAndDelete(meeting._id);
        } else {
          // Update with only future dates
          await MeetingSchedule.findByIdAndUpdate(meeting._id, {
            meeting_dates: updatedDates,
            number_of_meetings: updatedDates.length
          });
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Cleaned up old reminders',
      past_meetings_removed: pastMeetingsRemoved,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error clearing old reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear old reminders',
      error: error.message
    });
  }
};
// In reminderController.js, add these functions:

// Debug reminder service logic
exports.debugReminderService = async (req, res) => {
  try {
    const { debugReminderLogic } = require('../services/reminderService');
    const debugInfo = await debugReminderLogic();
    
    res.json({
      success: true,
      debug: debugInfo,
      message: 'Debug information generated',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message
    });
  }
};

// Create test meeting for reminders
exports.createTestMeetingForReminders = async (req, res) => {
  try {
    const { mentor_email, mentee_email, days_from_now } = req.body;
    
    if (!mentor_email || !mentee_email || !days_from_now) {
      return res.status(400).json({
        success: false,
        message: 'mentor_email, mentee_email, and days_from_now are required'
      });
    }
    
    // Find users
    const mentor = await User.findOne({
      'basic.email_id': { $regex: new RegExp(`^${mentor_email.trim().toLowerCase()}$`, "i") }
    });
    
    const mentee = await User.findOne({
      'basic.email_id': { $regex: new RegExp(`^${mentee_email.trim().toLowerCase()}$`, "i") }
    });
    
    if (!mentor || !mentee) {
      return res.status(404).json({
        success: false,
        message: 'Mentor or mentee not found'
      });
    }
    
    // Calculate date
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + parseInt(days_from_now));
    meetingDate.setHours(14, 0, 0, 0); // 2:00 PM
    
    // Create test meeting
    const MeetingSchedule = require('../models/MeetingSchedule');
    const mongoose = require('mongoose');
    
    const testMeeting = new MeetingSchedule({
      mentor_user_id: mentor._id,
      mentee_user_ids: [mentee._id],
      meeting_dates: [{
        date: meetingDate,
        meeting_id: new mongoose.Types.ObjectId()
      }],
      meeting_time: '14:00',
      duration_minutes: 60,
      platform: 'Zoom',
      meeting_link: 'https://zoom.us/test-meeting',
      agenda: `Test meeting for reminder (${days_from_now} days from now)`,
      number_of_meetings: 1
    });
    
    await testMeeting.save();
    
    res.json({
      success: true,
      message: `Test meeting created for ${days_from_now} days from now`,
      meeting: {
        id: testMeeting._id,
        date: meetingDate.toISOString(),
        formatted_date: meetingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: '2:00 PM',
        mentor: mentor.basic?.name,
        mentee: mentee.basic?.name,
        will_trigger_reminder: days_from_now === '7' || days_from_now === '3'
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating test meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test meeting',
      error: error.message
    });
  }
};
