import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { email, password, profileName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await UserService.createUser({
        email,
        password,
        profile: profileName ? {
          create: { name: profileName }
        } : undefined
      });

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getMe(req: Request, res: Response) {
    return res.status(200).json({
      user: req.user,
      profile: req.profile
    });
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      await UserService.updateStatus(Number(id), isActive);
      return res.status(200).json({ message: `User status updated to ${isActive ? 'active' : 'inactive'}` });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
