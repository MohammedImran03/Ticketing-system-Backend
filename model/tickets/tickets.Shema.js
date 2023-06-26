const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    tags: {
      type: String,
      default: null,
    },
    preferredLanguage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      minlength: 5,
      maxlength: 255,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      minlength: 5,
      maxlength: 1000,
      trim: true,
      required: true,
    },
    availableTimefrom: {
      type: String,
      required: true,
    },
    availableTimetill: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      default: null,
    },
    rasiedBy: {
      type: Schema.Types.ObjectId,
      required: true,
  },
  assignedTo: {
      type: Schema.Types.ObjectId,
      default:null,
  },
  assignedmentorname:{
    type: String,
    default:null,
  },
    conversations: [
      {
        sender: {
          type: String,
          maxlength: 50,
          default: "",
        },
        file: {
          type: String,
          maxlength: 1000,
          default: null,
        },
        message: {
          type: String,
          maxlength: 1000,
          default: "",
        },
        msgAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    solution: {
      type: String,
      minlength: 15,
      maxlength: 1000,
      trim: true,
      default: null,
    },
    feedback: {
      type: String,
      minlength: 5,
      maxlength: 1000,
      trim: true,
      default: null,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    status: {
      type: String,
      default: "UNASSIGNED",
    },
  },
  { timestamps: true }
);

// const QueryJoiSchema = Joi.object({
//     title: Joi.string().min(5).max(255).required(),
//     description: Joi.string().min(5).max(1000).required(),
//     category: Joi.string().required(),
//     subCategory: Joi.string().allow(""),
//     tags: Joi.array().items(Joi.string()).required(),
//     preferredLanguage: Joi.string().required(),
//     availableTime: Joi.object({
//         from: Joi.string()
//             .pattern(/(\d{2}):(\d{2})/, "hh:mm Time")
//             .required(),
//         till: Joi.string()
//             .pattern(/(\d{2}):(\d{2})/, "hh:mm Time")
//             .required(),
//     }).required(),
// });

module.exports = {
  TicketSchema: mongoose.model("Query", TicketSchema),
};
