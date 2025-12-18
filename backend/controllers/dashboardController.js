// controllers/dashboardController.js - UPDATED TO MATCH WORKING PATTERN
const Phase = require("../models/Phase");
const MenteeRequest = require("../models/MenteeRequest");
const MentorRegistration = require("../models/MentorRegistration");
const MentorMenteeAssignment = require("../models/MentorMenteeAssignment");
const MeetingSchedule = require("../models/MeetingSchedule");
const MeetingStatus = require("../models/MeetingStatus");
const ProgramFeedback = require("../models/ProgramFeedback");
const User = require("../models/User");

// ==================== GET ALL MENTORS WITH FORMATTED DATA ====================
exports.getAllMentors = async (req, res) => {
  try {
    console.log("🔍 Fetching all mentors...");
    
    // Get all mentor registrations
    const mentors = await MentorRegistration.find();
    console.log(`📊 Found ${mentors.length} mentor registrations`);

    // Format mentors with user details (following your working pattern)
    const formatted = await Promise.all(
      mentors.map(async (m) => {
        const user = await User.findById(m.mentor_id);
        console.log(`Looking up User for mentor_id: ${m.mentor_id} => ${user ? "Found" : "Not found"}`);

        return {
          _id: m._id,
          mentor_id: m.mentor_id,
          user_id: user?._id || m.mentor_id || null,
          name: user?.basic?.name || "Unknown Mentor",
          email: user?.basic?.email_id || "No email found",
          areas_of_interest: m.areas_of_interest || [],
          description: m.description || "",
          phaseId: m.phaseId || "N/A",
          createdAt: m.createdAt
        };
      })
    );

    console.log(`✅ Final mentors sent to frontend: ${formatted.length}`);
    res.json({ 
      success: true, 
      mentors: formatted,
      stats: {
        total: formatted.length,
        withName: formatted.filter(m => m.name !== "Unknown Mentor").length,
        withEmail: formatted.filter(m => m.email !== "No email found").length
      }
    });

  } catch (err) {
    console.error("❌ Error fetching mentors:", err);
    res.status(500).json({ success: false, message: "Server error fetching mentors" });
  }
};

// ==================== GET ALL MENTEES WITH FORMATTED DATA ====================
exports.getAllMentees = async (req, res) => {
  try {
    console.log("🔍 Fetching all mentees...");
    
    const mentees = await MenteeRequest.find();
    console.log(`📊 Found ${mentees.length} mentee requests`);

    // Get already assigned mentees
    const assignments = await MentorMenteeAssignment.find();
    const assignedIds = assignments.flatMap(a => 
      a.mentee_user_ids.map(id => id.toString())
    );

    const formatted = await Promise.all(
      mentees.map(async (m) => {
        const user = await User.findById(m.mentee_user_id);

        return {
          _id: m._id,
          mentee_user_id: m.mentee_user_id,
          user_id: user?._id || m.mentee_user_id,
          name: user?.basic?.name || "Unknown Mentee",
          email: user?.basic?.email_id || "No email found",
          area_of_interest: m.area_of_interest || "Not specified",
          description: m.description || "",
          phaseId: m.phaseId || "N/A",
          status: m.status || "pending",
          assigned: assignedIds.includes(m.mentee_user_id.toString()),
          createdAt: m.createdAt
        };
      })
    );

    console.log(`✅ Final mentees sent to frontend: ${formatted.length}`);
    res.json({ 
      success: true, 
      mentees: formatted,
      stats: {
        total: formatted.length,
        pending: formatted.filter(m => m.status === "pending").length,
        assigned: formatted.filter(m => m.assigned).length,
        unassigned: formatted.filter(m => !m.assigned).length
      }
    });

  } catch (err) {
    console.error("❌ Error fetching mentees:", err);
    res.status(500).json({ success: false, message: "Server error fetching mentees" });
  }
};

// ==================== GET ALL ASSIGNMENTS WITH FORMATTED DATA ====================
exports.getAllAssignments = async (req, res) => {
  try {
    console.log("🔍 Fetching all assignments...");
    
    const assignments = await MentorMenteeAssignment.find();
    console.log(`📊 Found ${assignments.length} assignments`);

    const formatted = await Promise.all(
      assignments.map(async (assignment) => {
        // Get mentor details
        const mentor = await User.findById(assignment.mentor_user_id);
        
        // Get all mentees details
        const mentees = await Promise.all(
          assignment.mentee_user_ids.map(async (menteeId) => {
            const mentee = await User.findById(menteeId);
            return {
              _id: menteeId,
              name: mentee?.basic?.name || "Unknown Mentee",
              email: mentee?.basic?.email_id || "No email"
            };
          })
        );

        return {
          _id: assignment._id,
          mentor_user_id: assignment.mentor_user_id,
          mentorDetails: {
            name: mentor?.basic?.name || "Unknown Mentor",
            email: mentor?.basic?.email_id || "No email"
          },
          mentees: mentees,
          commencement_date: assignment.commencement_date,
          end_date: assignment.end_date,
          phaseId: assignment.phaseId,
          createdAt: assignment.createdAt
        };
      })
    );

    console.log(`✅ Final assignments sent to frontend: ${formatted.length}`);
    res.json({ 
      success: true, 
      assignments: formatted,
      stats: {
        total: formatted.length,
        totalMentees: formatted.reduce((sum, a) => sum + a.mentees.length, 0),
        avgMenteesPerMentor: (formatted.reduce((sum, a) => sum + a.mentees.length, 0) / formatted.length).toFixed(1)
      }
    });

  } catch (err) {
    console.error("❌ Error fetching assignments:", err);
    res.status(500).json({ success: false, message: "Server error fetching assignments" });
  }
};

// ==================== GET ALL MEETINGS WITH FORMATTED DATA ====================
exports.getAllMeetings = async (req, res) => {
  try {
    console.log("🔍 Fetching all meetings...");
    
    const { dateFrom, dateTo, status } = req.query;
    
    // Build filter
    const filter = {};
    if (dateFrom || dateTo) {
      filter["meeting_dates.date"] = {};
      if (dateFrom) filter["meeting_dates.date"].$gte = new Date(dateFrom);
      if (dateTo) filter["meeting_dates.date"].$lte = new Date(dateTo);
    }
    
    const meetings = await MeetingSchedule.find(filter);
    console.log(`📊 Found ${meetings.length} meetings`);

    const formatted = await Promise.all(
      meetings.map(async (meeting) => {
        // Get mentor details
        const mentor = await User.findById(meeting.mentor_user_id);
        
        // Get all mentees details
        const mentees = await Promise.all(
          meeting.mentee_user_ids.map(async (menteeId) => {
            const mentee = await User.findById(menteeId);
            return {
              _id: menteeId,
              name: mentee?.basic?.name || "Unknown Mentee",
              email: mentee?.basic?.email_id || "No email"
            };
          })
        );
        
        // Get meeting status
        let meetingStatus = "Scheduled";
        if (meeting.meeting_dates && meeting.meeting_dates.length > 0) {
          const firstDate = meeting.meeting_dates[0];
          if (firstDate.meeting_id) {
            const statusDoc = await MeetingStatus.findOne({ meeting_id: firstDate.meeting_id });
            if (statusDoc) {
              meetingStatus = statusDoc.status;
            }
          }
        }

        return {
          _id: meeting._id,
          mentor_user_id: meeting.mentor_user_id,
          mentorDetails: {
            name: mentor?.basic?.name || "Unknown Mentor",
            email: mentor?.basic?.email_id || "No email"
          },
          mentees: mentees,
          meeting_dates: meeting.meeting_dates || [],
          meeting_time: meeting.meeting_time,
          duration_minutes: meeting.duration_minutes,
          platform: meeting.platform,
          meeting_link: meeting.meeting_link,
          agenda: meeting.agenda,
          preferred_day: meeting.preferred_day,
          number_of_meetings: meeting.number_of_meetings,
          createdAt: meeting.createdAt,
          status: meetingStatus
        };
      })
    );

    // Apply status filter if specified
    let filteredMeetings = formatted;
    if (status && status !== 'all') {
      filteredMeetings = formatted.filter(m => 
        m.status && m.status.toLowerCase() === status.toLowerCase()
      );
    }

    console.log(`✅ Final meetings sent to frontend: ${filteredMeetings.length}`);
    res.json({ 
      success: true, 
      meetings: filteredMeetings,
      stats: {
        total: filteredMeetings.length,
        scheduled: filteredMeetings.filter(m => m.status === "Scheduled" || m.status === "scheduled").length,
        completed: filteredMeetings.filter(m => m.status === "Completed" || m.status === "completed").length,
        cancelled: filteredMeetings.filter(m => m.status === "Cancelled" || m.status === "cancelled").length
      }
    });

  } catch (err) {
    console.error("❌ Error fetching meetings:", err);
    res.status(500).json({ success: false, message: "Server error fetching meetings" });
  }
};

// ==================== GET ALL FEEDBACKS WITH FORMATTED DATA ====================
exports.getAllFeedbacks = async (req, res) => {
  try {
    console.log("🔍 Fetching all feedbacks...");
    
    const feedbacks = await ProgramFeedback.find();
    console.log(`📊 Found ${feedbacks.length} feedbacks`);

    const formatted = await Promise.all(
      feedbacks.map(async (feedback) => {
        const user = await User.findById(feedback.user_id);

        return {
          _id: feedback._id,
          user_id: feedback.user_id,
          userDetails: {
            name: user?.basic?.name || "Anonymous User",
            email: user?.basic?.email_id || "No email"
          },
          role: feedback.role,
          programOrganization: feedback.programOrganization,
          matchingProcess: feedback.matchingProcess,
          supportProvided: feedback.supportProvided,
          overallSatisfaction: feedback.overallSatisfaction,
          generalFeedback: feedback.generalFeedback,
          suggestions: feedback.suggestions,
          participateAgain: feedback.participateAgain,
          createdAt: feedback.createdAt
        };
      })
    );

    console.log(`✅ Final feedbacks sent to frontend: ${formatted.length}`);
    res.json({ 
      success: true, 
      feedbacks: formatted,
      stats: {
        total: formatted.length,
        mentors: formatted.filter(f => f.role === "mentor").length,
        mentees: formatted.filter(f => f.role === "mentee").length
      }
    });

  } catch (err) {
    console.error("❌ Error fetching feedbacks:", err);
    res.status(500).json({ success: false, message: "Server error fetching feedbacks" });
  }
};

// ==================== GET DASHBOARD STATISTICS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Get counts using the same pattern
    const totalMentors = await MentorRegistration.countDocuments();
    const totalMentees = await MenteeRequest.countDocuments();
    
    // New this week
    const newMentorsThisWeek = await MentorRegistration.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    const newMenteesThisWeek = await MenteeRequest.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    // Get phase-wise counts
    const phases = await Phase.find().sort({ phaseId: 1 });
    const phaseStats = await Promise.all(
      phases.map(async (phase) => {
        const mentorCount = await MentorRegistration.countDocuments({ phaseId: phase.phaseId });
        const menteeCount = await MenteeRequest.countDocuments({ phaseId: phase.phaseId });
        
        return {
          phaseId: phase.phaseId,
          phaseName: phase.name,
          startDate: phase.startDate,
          endDate: phase.endDate,
          totalMentors: mentorCount,
          totalMentees: menteeCount
        };
      })
    );

    // Meeting stats
    const totalMeetings = await MeetingSchedule.countDocuments();
    const upcomingMeetings = await MeetingSchedule.countDocuments({
      'meeting_dates.date': { $gte: new Date() }
    });

    res.json({
      success: true,
      stats: {
        totalMentors,
        totalMentees,
        newMentorsThisWeek,
        newMenteesThisWeek,
        totalMeetings,
        upcomingMeetings,
        phaseStats
      },
      lastUpdated: new Date()
    });

  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== GET RECENT ACTIVITY ====================
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Recent mentor registrations
    const recentMentors = await MentorRegistration.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    const activities = await Promise.all(
      recentMentors.map(async (mentor) => {
        const user = await User.findById(mentor.mentor_id);
        return {
          type: 'mentor_registration',
          user: user?.basic?.name || "New Mentor",
          email: user?.basic?.email_id || "",
          timestamp: mentor.createdAt,
          message: 'registered as a mentor'
        };
      })
    );

    res.json({
      success: true,
      activities: activities.slice(0, limit)
    });

  } catch (err) {
    console.error("❌ Error fetching recent activity:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== DEBUG: CHECK USER DATA ====================
exports.debugUserData = async (req, res) => {
  try {
    // Check a specific mentor from your data
    const mentorId = "68dfc1c151c797667a437b54"; // From your example
    const user = await User.findById(mentorId);
    
    // Check mentor registration
    const mentorReg = await MentorRegistration.findOne({ mentor_id: mentorId });
    
    // Check all users structure
    const allUsers = await User.find().limit(3);
    
    res.json({
      success: true,
      debug: {
        userExists: !!user,
        userData: user ? {
          _id: user._id,
          hasBasic: !!user.basic,
          basicFields: user.basic ? Object.keys(user.basic) : [],
          name: user.basic?.name,
          email: user.basic?.email_id
        } : null,
        mentorRegistration: mentorReg,
        sampleUsers: allUsers.map(u => ({
          _id: u._id,
          name: u.basic?.name,
          email: u.basic?.email_id
        }))
      }
    });

  } catch (err) {
    console.error("Debug error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};