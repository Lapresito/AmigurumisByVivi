import { connect } from 'mongoose';
import config from '../config.js';
export async function connectMongo() {
  try {
    await connect(config.mongoDbUrl);
    console.log("Plug to mongo!");
  } catch (error) {
    console.log('Something wrong happend with the db');
    throw "can not connect to the db";
  }
};