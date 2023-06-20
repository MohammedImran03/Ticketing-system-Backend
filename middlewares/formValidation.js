const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});
const pin = Joi.number().min(10000).max(999999).required();
const newPassword = Joi.string().min(3).max(30).required();
const shortStr = Joi.string().min(5).max(100);
const longStr = Joi.string().min(15).max(1000);
// const dt = Joi.date();

const resetPassReqValidation = (req, res, next) => {
  const schema = Joi.object({ email });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const updatePassValidation = (req, res, next) => {
	const schema = Joi.object({ email, pin, newPassword });

	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}
	next();
};

const createNewTicketValidation = (req, res, next) => {
	const schema = Joi.object({
category:shortStr.required(),
subCategory:shortStr.required(),
preferredLanguage:shortStr.required(),
title:Joi.string().min(5).max(100).required(),
description:longStr.required(),
	});
console.log(req.body);
	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}
	next();
};


module.exports = {
  resetPassReqValidation,
  updatePassValidation,
  createNewTicketValidation
};
