import { connect } from 'mongoose';
import mongoose from 'mongoose';
import config from './config.js';
import logger from './utils/logger.js';
export async function connectMongo() {
  try {
    await connect(config.mongoDbUrl);
    logger.info("Plug to mongo!");
  } catch (error) {
    logger.error('Something wrong happend with the db');
    throw "can not connect to the db";
  }
};
export async function idValidation(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid mongo ID format");
      throw new Error("Invalid mongo ID format");
    }
  } catch (error) {
    logger.error({ error: error, errorMsg: error.message });
    throw new Error(error.message);
  }
}