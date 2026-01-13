import { NextFunction, Request, Response } from 'express';
import prisma from '../config/db';

export const auditLog = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // We capture the response finish event to log the outcome
    res.on('finish', async () => {
      try {
        if (req.user) {
          await prisma.auditLog.create({
            data: {
              action: action as any,
              entity: req.path,
              performedById: req.user.id,
              details: {
                method: req.method,
                statusCode: res.statusCode,
                ip: req.ip,
                userAgent: req.get('user-agent'),
                params: req.params,
                query: req.query
              }
            }
          });
        }
      } catch (error) {
        console.error('Audit log error:', error);
      }
    });

    next();
  };
};
