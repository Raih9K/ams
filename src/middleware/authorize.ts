import { NextFunction, Request, Response } from 'express';
import prisma from '../config/db';

export const authorize = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.profile) {
        return res.status(403).json({ message: 'Forbidden: No active profile' });
      }

      // Check if the permission exists for the current profile
      const permission: any = await prisma.permission.findFirst({
        where: {
          name: permissionName,
          profiles: {
            some: { id: req.profile.id }
          }
        }
      });

      if (!permission) {
        return res.status(403).json({ message: `Permission denied: ${permissionName}` });
      }

      // Check for time-based validity
      if (permission.scope === 'TIME_BASED') {
        const now = new Date();
        if (permission.startDate && now < new Date(permission.startDate)) {
          return res.status(403).json({ message: 'Permission not yet active' });
        }
        if (permission.endDate && now > new Date(permission.endDate)) {
          return res.status(403).json({ message: 'Permission expired' });
        }
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Internal server error during authorization' });
    }
  };
};
