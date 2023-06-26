const {TicketSchema}= require("./tickets.Shema");

const insertTicket = (ticketObj) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema(ticketObj)
          .save()
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const getallTickets = () => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.find({})
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };


  const getTickets = (rasiedBy) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.find({ rasiedBy })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };


const getTicketsformentor = (assignedTo) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.find({ assignedTo })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const getTicketById = (_id, rasiedBy) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.find({ _id, rasiedBy })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const updatetoassigned = ({ _id, assignedtoid,firstname}) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndUpdate(
          { _id },
          {
            status: "ASSIGNED",
            assignedTo:assignedtoid,
            assignedmentorname:firstname
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };


  const updateClientReply = ({ _id, message, sender,file,msgAt}) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndUpdate(
          { _id },
          {
            status: "ASSIGNED",
            $push: {
              conversations: { message, sender, file,msgAt},
            },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateStatusClose = ({ _id, rasiedBy }) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndUpdate(
          { _id, rasiedBy },
          {
            status: "CLOSED",
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  module.exports={
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    updatetoassigned,
    getallTickets,
    getTicketsformentor
  }