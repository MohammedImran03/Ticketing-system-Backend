const express = require("express");
const ticketrouter = express.Router();
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  updatetoassigned,
  getallTickets,
  getTicketsformentor,
  getmentorTicketById,
} = require("../model/tickets/tickets.model");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const {createNewTicketValidation}=require("../middlewares/formValidation");
const {getUserById} = require("../model/user/users.model");

ticketrouter.all("/", (req, res, next) => {
  // res.json({ message: "return form ticket router" });

  next();
});

//Get all tickets
ticketrouter.get("/alltickets",userAuthorization,async (req, res) => {
  try {
    const result = await getallTickets();
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});


//To create a new ticket
ticketrouter.post("/addnewticket", userAuthorization, async (req, res) => {
  try {
    const {
      category,
      subCategory,
      tags,
      preferredLanguage,
      title,
      description,
      availableTimefrom,
      availableTimetill,
      rasiedBy,
      studentmobileno,
    } = req.body;
    // console.log(req.userId);
    const userId = req.userId;
    const userProfile = await getUserById(userId);
    const {email,mobile} = userProfile;
    const ticketObj = {
      category,
      subCategory,
      tags,
      preferredLanguage,
      title,
      description,
      availableTimefrom,
      availableTimetill,
      rasiedBy: userId,
      email,
      studentmobileno: mobile,
    };
    const result = await insertTicket(ticketObj);
    if (result._id) {
      return res.json({
        status: "success",
        message: "New ticket has been created!",
      });
    }
    res.json({
      status: "error",
      message: "Unable to create the ticket , please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Get all tickets for a specific user
ticketrouter.get("/usertickets", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getTickets(userId);
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});


//Get tickets for specific mentors 
ticketrouter.get("/mentortickets", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getTicketsformentor(userId);
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});


// Get users specific tickets
ticketrouter.get("/gettickets/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const rasiedBy = req.userId;
    const result = await getTicketById(_id, rasiedBy);
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Get mentor specific tickets
ticketrouter.get("/getmentortickets/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const  assignedTo= req.userId;
    const result = await getmentorTicketById(_id, assignedTo);
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// update ticket to assign to client
ticketrouter.put("/assign-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const assignedtoid = req.userId;
    const userProfile = await getUserById(assignedtoid);
    const {firstname} = userProfile;
    const result = await updatetoassigned({ _id, assignedtoid,firstname});
    if (result._id) {
      return res.json({
        status: "success",
        message: "Ticket Status has been Successfully",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update the ticket please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// update reply message form client
ticketrouter.put("/reply-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const senderid = req.userId;
    // const userProfile = await getUserById(senderid);
    // const {role} = userProfile;
    const { message,file,msgAt} = req.body;
    const result = await updateClientReply({ _id, message, sender:senderid,file,msgAt});
    if (result._id) {
      return res.json({
        status: "success",
        message: "your message updated",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update your message please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});


// Update ticet to close updateStatusClose
ticketrouter.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const rasiedBy = req.userId;
    const {solution,rating}=req.body;
    const result = await updateStatusClose({ _id, rasiedBy,solution,rating });
    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update the ticket",
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

module.exports = ticketrouter;

// category
// subCategory
// preferredLanguage
// title
// description
// availableTimefrom
// availableTimetill
// rasiedBy
