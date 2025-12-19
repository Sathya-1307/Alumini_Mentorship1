// controllers/homeDashboardController.js
const Phase = require("../models/Phase");
const MenteeRequest = require("../models/MenteeRequest");
const MentorRegistration = require("../models/MentorRegistration");
const MentorMenteeAssignment = require("../models/MentorMenteeAssignment");
const MeetingSchedule = require("../models/MeetingSchedule");
const MeetingStatus = require("../models/MeetingStatus");
const ProgramFeedback = require("../models/ProgramFeedback");
const User = require("../models/User");

// ==================== GET HOME DASHBOARD OVERVIEW ====================
exports.getHomeDashboardOverview = async (req, res) => {
  try {
    const { phaseId } = req.query;
    
    // Get all phases for filter
    const allPhases = await Phase.find().sort({ phaseId: 1 });
    
    // Determine which phase to show
    let currentPhase;
    if (phaseId) {
      currentPhase = await Phase.findOne({ phaseId: parseInt(phaseId) });
    } else {
      // Get current active phase
      currentPhase = await Phase.findOne({
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      }).sort({ phaseId: -1 });
    }
    
    const activePhaseId = currentPhase?.phaseId || 1;
    
    // Get ALL data (not filtered by phase initially)
    const [
      allMentors,
      allMentees,
      allAssignments,
      allMeetings,
      allFeedbacks
    ] = await Promise.all([
      MentorRegistration.find().populate('mentor_id', 'basic.name basic.email_id'),
      MenteeRequest.find().populate('mentee_user_id', 'basic.name basic.email_id'),
      MentorMenteeAssignment.find().populate('mentor_user_id mentee_user_ids', 'basic.name basic.email_id'),
      MeetingSchedule.find().populate('mentor_user_id mentee_user_ids', 'basic.name'),
      ProgramFeedback.find().populate('user_id', 'basic.name')
    ]);

    // Filter data by selected phase
    const phaseFilter = (item) => !phaseId || item.phaseId === parseInt(phaseId);
    
    const mentors = allMentors.filter(phaseFilter);
    const mentees = allMentees.filter(phaseFilter);
    const assignments = allAssignments;
    const meetings = allMeetings;
    const feedbacks = allFeedbacks;

    // Calculate meeting statistics BASED ON SCHEDULING DATE
    const now = new Date();
    const upcomingMeetings = meetings.filter(meeting => {
      const meetingDate = meeting.meeting_dates?.[0]?.date;
      return meetingDate && new Date(meetingDate) > now;
    }).length;

    const pastMeetings = meetings.filter(meeting => {
      const meetingDate = meeting.meeting_dates?.[0]?.date;
      return meetingDate && new Date(meetingDate) <= now;
    }).length;

    // Get completed meetings from status
    const completedMeetings = await MeetingStatus.countDocuments({ 
      status: 'Completed' 
    });

    // Get mentor capacity data
    const mentorCapacityData = [];
    mentors.forEach(mentor => {
      const mentorAssignments = assignments.filter(a => 
        a.mentor_user_id?.toString() === mentor.mentor_id?.toString()
      );
      const assignedMentees = mentorAssignments.flatMap(a => a.mentee_user_ids);
      const assignedMenteeNames = assignedMentees.map(m => m?.basic?.name || 'Mentee');
      
      mentorCapacityData.push({
        id: mentor._id,
        mentorId: mentor.mentor_id,
        name: mentor.mentor_id?.basic?.name || 'Unknown Mentor',
        email: mentor.mentor_id?.basic?.email_id || '',
        menteeCount: assignedMentees.length,
        maxCapacity: 3,
        mentees: assignedMenteeNames,
        capacityPercentage: Math.min((assignedMentees.length / 3) * 100, 100),
        phaseId: mentor.phaseId,
        areasOfInterest: mentor.areas_of_interest || []
      });
    });

    // Calculate phase-wise statistics for the graph
    const phaseWiseStats = [];
    for (const phase of allPhases) {
      const phaseMentors = allMentors.filter(m => m.phaseId === phase.phaseId).length;
      const phaseMentees = allMentees.filter(m => m.phaseId === phase.phaseId).length;
      
      phaseWiseStats.push({
        phaseId: phase.phaseId,
        name: `Phase ${phase.phaseId}`,
        mentors: phaseMentors,
        mentees: phaseMentees,
        startDate: phase.startDate,
        endDate: phase.endDate,
        isActive: currentPhase?.phaseId === phase.phaseId
      });
    }

    // Prepare mentorship summary
    const mentorshipSummary = {
      totalMentors: mentors.length,
      totalMentees: mentees.length,
      totalAssignments: assignments.length,
      completedMeetings: completedMeetings,
      upcomingMeetings: upcomingMeetings,
      pastMeetings: pastMeetings,
      totalMeetings: meetings.length,
      feedbacks: feedbacks.length
    };

    // Recent activity
    const recentMeetings = meetings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(m => ({
        id: m._id,
        mentor: m.mentor_user_id?.basic?.name || 'Mentor',
        mentees: m.mentee_user_ids?.map(mentee => mentee?.basic?.name).join(', ') || 'Mentees',
        date: m.meeting_dates?.[0]?.date,
        time: m.meeting_time,
        duration: m.duration_minutes,
        status: 'upcoming',
        topic: m.agenda || 'Mentorship Session'
      }));

    res.json({
      success: true,
      data: {
        // Key Statistics
        summary: mentorshipSummary,
        
        // Phase-wise Statistics for Graph
        phaseStats: phaseWiseStats,
        
        // Current Phase Information
        currentPhase: {
          phaseId: currentPhase?.phaseId || 1,
          name: currentPhase?.name || `Phase ${activePhaseId}`,
          startDate: currentPhase?.startDate,
          endDate: currentPhase?.endDate,
          status: currentPhase ? 
            (new Date() > new Date(currentPhase.endDate) ? 'completed' : 
             new Date() < new Date(currentPhase.startDate) ? 'upcoming' : 'active') : 
            'active'
        },
        
        // All Phases for Filter
        allPhases: allPhases.map(p => ({
          phaseId: p.phaseId,
          name: p.name,
          startDate: p.startDate,
          endDate: p.endDate
        })),
        
        // Mentor Data for Carousel
        mentorCapacity: mentorCapacityData,
        
        // Recent Activity
        recentActivity: {
          meetings: recentMeetings
        }
      },
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Home Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching home dashboard data' });
  }
};

// ==================== GET PHASE DETAILS FOR HOME DASHBOARD ====================
exports.getHomePhaseDetails = async (req, res) => {
  try {
    const { phaseId } = req.params;
    
    const phase = await Phase.findOne({ phaseId: parseInt(phaseId) });
    if (!phase) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    const [mentors, mentees, meetings] = await Promise.all([
      MentorRegistration.find({ phaseId: parseInt(phaseId) })
        .populate('mentor_id', 'basic.name basic.email_id'),
      MenteeRequest.find({ phaseId: parseInt(phaseId) })
        .populate('mentee_user_id', 'basic.name basic.email_id'),
      MeetingSchedule.find()
        .populate('mentor_user_id mentee_user_ids', 'basic.name')
    ]);

    res.json({
      success: true,
      data: {
        phase: {
          ...phase.toObject(),
          mentorsCount: mentors.length,
          menteesCount: mentees.length,
          meetingsCount: meetings.length
        },
        mentors: mentors.map(m => ({
          id: m._id,
          name: m.mentor_id?.basic?.name || 'Unknown',
          email: m.mentor_id?.basic?.email_id || '',
          areasOfInterest: m.areas_of_interest,
          createdAt: m.createdAt
        })),
        mentees: mentees.map(m => ({
          id: m._id,
          name: m.mentee_user_id?.basic?.name || 'Unknown',
          email: m.email || '',
          areaOfInterest: m.area_of_interest,
          status: m.status,
          createdAt: m.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Home Phase details error:', error);
    res.status(500).json({ success: false, message: 'Error fetching phase details' });
  }
};

// ==================== GET QUICK STATS FOR HOME DASHBOARD ====================
exports.getHomeQuickStats = async (req, res) => {
  try {
    const [totalMentors, totalMentees, activeMeetings, pendingRequests] = await Promise.all([
      MentorRegistration.countDocuments(),
      MenteeRequest.countDocuments(),
      MeetingSchedule.countDocuments({ 
        'meeting_dates.0.date': { $gte: new Date() }
      }),
      MenteeRequest.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        totalMentors,
        totalMentees,
        activeMeetings,
        pendingRequests,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Quick stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quick stats' });
  }
};