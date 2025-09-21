const Joi = require('joi');
const { USER_ROLES } = require('../constants/roles');

// Validation schemas
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().min(2).max(255).required(),
  role: Joi.number().valid(USER_ROLES.USER, USER_ROLES.ADMIN).optional().default(USER_ROLES.USER)
});

const userUpdateSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  full_name: Joi.string().min(2).max(255).optional(),
  role: Joi.number().valid(USER_ROLES.USER, USER_ROLES.ADMIN).optional()
}).min(1);

const containerSchema = Joi.object({
  code: Joi.string().min(1).max(50).required(),
  location: Joi.string().min(1).max(100).required(),
  student_id: Joi.string().uuid().required()
});

const containerUpdateSchema = Joi.object({
  code: Joi.string().min(1).max(50).optional(),
  location: Joi.string().min(1).max(100).optional(),
  student_id: Joi.string().uuid().optional()
}).min(1);

const sensorDataSchema = Joi.object({
  container_id: Joi.string().uuid().required(),
  temperature: Joi.number().precision(2).required(),
  humidity: Joi.number().precision(2).required(),
  gas: Joi.number().precision(2).required(),
  ph: Joi.number().precision(2).required(),
  student_id: Joi.string().uuid().required()
});

const sensorDataUpdateSchema = Joi.object({
  container_id: Joi.string().uuid().optional(),
  temperature: Joi.number().precision(2).optional(),
  humidity: Joi.number().precision(2).optional(),
  gas: Joi.number().precision(2).optional(),
  ph: Joi.number().precision(2).optional(),
  student_id: Joi.string().uuid().optional()
}).min(1);

const reportSchema = Joi.object({
  student_id: Joi.string().uuid().required(),
  container_id: Joi.string().uuid().required(),
  notes: Joi.string().allow('').optional()
});

const reportUpdateSchema = Joi.object({
  student_id: Joi.string().uuid().optional(),
  container_id: Joi.string().uuid().optional(),
  notes: Joi.string().allow('').optional()
}).min(1);

const studentSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).required()
});

const studentUpdateSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional()
}).min(1);

const sheepSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  age: Joi.number().integer().min(0).optional()
});

const sheepUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  age: Joi.number().integer().min(0).optional()
}).min(1);

const sheepReportSchema = Joi.object({
  sheep_id: Joi.string().uuid().required(),
  feeding_time: Joi.date().iso().required(),
  status: Joi.string().min(1).max(50).required()
});

const sheepReportUpdateSchema = Joi.object({
  sheep_id: Joi.string().uuid().optional(),
  feeding_time: Joi.date().iso().optional(),
  status: Joi.string().min(1).max(50).optional()
}).min(1);

// Parameter validation schemas
const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional().default(50),
  offset: Joi.number().integer().min(0).optional().default(0)
});

// Validation middleware functions
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateContainer = (req, res, next) => {
  const { error } = containerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateContainerUpdate = (req, res, next) => {
  const { error } = containerUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateSensorData = (req, res, next) => {
  const { error } = sensorDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateSensorDataUpdate = (req, res, next) => {
  const { error } = sensorDataUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateReport = (req, res, next) => {
  const { error } = reportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateReportUpdate = (req, res, next) => {
  const { error } = reportUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateSheep = (req, res, next) => {
  const { error } = sheepSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateSheepUpdate = (req, res, next) => {
  const { error } = sheepUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateSheepReport = (req, res, next) => {
  const { error } = sheepReportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateSheepReportUpdate = (req, res, next) => {
  const { error } = sheepReportUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateStudent = (req, res, next) => {
  const { error } = studentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validateStudentUpdate = (req, res, next) => {
  const { error } = studentUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

// Parameter validation middleware
const validateUuidParam = (req, res, next) => {
  const { error } = uuidParamSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  next();
};

const validatePagination = (req, res, next) => {
  const { error, value } = paginationSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message).join(', ')
    });
  }
  req.query = { ...req.query, ...value };
  next();
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validateContainer,
  validateContainerUpdate,
  validateSensorData,
  validateSensorDataUpdate,
  validateReport,
  validateReportUpdate,
  validateSheep,
  validateSheepUpdate,
  validateSheepReport,
  validateSheepReportUpdate,
  validateStudent,
  validateStudentUpdate,
  validateUuidParam,
  validatePagination
};
