const User = require('../models/User');
const { comparePassword, generateToken } = require('../utils/auth');
const { USER_ROLES } = require('../constants/roles');

class UserController {
  // GET /api/users
  static async getAll(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const users = await User.findAll(parseInt(limit), parseInt(offset));
      const total = await User.count();
      
      res.json({
        data: {
          users,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // GET /api/users/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // POST /api/users (Admin only)
  static async create(req, res) {
    try {
      const { email, password, full_name, role = USER_ROLES.USER } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'User with this email already exists'
        });
      }

      // Validate role
      if (role !== USER_ROLES.ADMIN) {
        return res.status(403).json({
          error: 'Invalid role. Must be Admin'
        });
      }

      hashedPassword = await hashPassword(password);

      const userData = {
        email,
        password: hashedPassword,
        full_name,
        role,
        created_by: req.user?.id || null,
        modified_by: req.user?.id || null
      };

      await User.create(userData);

      res.status(201).json({
        message: 'User created successfully',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // PUT /api/users/:id (Admin only)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { email, password, full_name, role } = req.body;
      
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      const updateData = {};
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (full_name) updateData.full_name = full_name;
      if (role !== undefined) {
        // Validate role
        if (role !== USER_ROLES.ADMIN) {
          return res.status(403).json({
            error: 'Invalid role. Must be Admin'
          });
        }
        updateData.role = role;
      }

      const updatedUser = await User.update(id, updateData, req.user?.id || id);

      res.json({
        data: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // DELETE /api/users/:id (Admin only)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      // Prevent admin from deleting themselves
      if (req.user.id === parseInt(id)) {
        return res.status(400).json({
          error: 'You cannot delete your own account'
        });
      }

      await User.delete(id);

      res.json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // POST /api/auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      const token = generateToken({ 
        id: user.id, 
        email: user.email,
        full_name: user.full_name,
        role: user.role
      });

      res.json({
        access_token: token,
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

module.exports = UserController;