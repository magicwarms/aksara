/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import * as NotificationController from './notification.controller';
/**
 * Router Definition
 */
const notificationRouter = express.Router();
/**
 * Controller Definitions
 */

notificationRouter.get('/', NotificationController.getAllNotification);
notificationRouter.get('/read', NotificationController.updateReadNotification);
notificationRouter.delete('/delete', NotificationController.deleteNotification);

export default notificationRouter;
