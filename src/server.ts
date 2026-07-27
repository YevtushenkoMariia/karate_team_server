
import 'dotenv/config';
import { buildApp } from './index';

import { logger } from './utils/logger';  

const startServer = async () => {
  const app = await buildApp(); 
  const portValue = process.env.PORT || '4000'; 
  
  try {
    await app.listen({
      port: parseInt(portValue), host: '0.0.0.0'
    });
    console.log(`Server is running on http://localhost:${portValue}`);

    logger.info(`Server is running on http://localhost:${portValue}`);
  

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

};

startServer();