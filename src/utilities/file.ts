import fs from 'fs';

import logger from '../config/logger';

export const deleteFile = (filePath: string): string | boolean => {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                logger.error(err);
                return err;
            }
        });
    }
    return true;
};
