const express = require("express");
const ticketrouter = express.Router();
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  updatetoassigned,
  getallTickets
} = require("../model/tickets/tickets.model");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const {createNewTicketValidation}=require("../middlewares/formValidation");
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
    } = req.body;
    // console.log(req.userId);
    const userId = req.userId;
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

// Get all users for a specific tickets
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


// update ticket to assign to client
ticketrouter.put("/assign-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const assignedtoid = req.userId;
    const result = await updatetoassigned({ _id, assignedtoid});
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
    // const rasiedBy = req.userId;
    const { message, sender,file,msgAt} = req.body;
    const result = await updateClientReply({ _id, message, sender,file,msgAt});
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

    const result = await updateStatusClose({ _id, rasiedBy });

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
