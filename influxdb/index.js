import { InfluxDB, Point } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_URL;
const client = new InfluxDB({ url, token });

const org = 'RadiusLab';
const bucket = 'logylman';
const writeClient = client.getWriteApi(org, bucket, 'ns');

// Promise-based setTimeout function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

from: 'u',
fid: '0x0',
to: 'f0',
tid: '0xA',
data: 'tx',

async function writeData() {
  try {
    for (let i = 0; i < 5; i++) {
      const point = new Point('measurement1').tag('tagname1', 'tagvalue1').intField('field1', i);

      writeClient.writePoint(point);
      await delay(i * 1000); // separate points by 1 second
    }
    await writeClient.flush();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

writeData().catch((error) => console.error('Unhandled error:', error));
