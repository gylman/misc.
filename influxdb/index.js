import { InfluxDB, Point } from '@influxdata/influxdb-client';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_URL;
const client = new InfluxDB({ url, token });
const org = 'RadiusLab';
const bucket = 'logylman';

export const logs = [
  {
    from: 'u',
    fid: '0x0',
    to: 'f0',
    tid: '0xA',
    data: 'tx',
  },
  {
    from: 'u',
    fid: '0x1',
    to: 'f0',
    tid: '0xA',
    data: 'tx',
  },
  {
    from: 'u',
    fid: '0x2',
    to: 'f0',
    tid: '0xA',
    data: 'tx',
  },

  {
    from: 'f0',
    fid: '0xA',
    to: 'l',
    tid: '0xE',
    data: 'tx',
  },

  {
    from: 'l',
    fid: '0xE',
    to: 'f3',
    tid: '0xD',
    data: 'oc',
  },

  {
    from: 'l',
    fid: '0xE',
    to: 'f0',
    tid: '0xA',
    data: 'oc',
  },

  {
    from: 'l',
    fid: '0xE',
    to: 'f2',
    tid: '0xC',
    data: 'oc',
  },
  {
    from: 'f0',
    fid: '0xA',
    to: 'u',
    tid: '0x0',
    data: 'oc',
  },

  {
    from: 'l',
    fid: '0xE',
    to: 'f1',
    tid: '0xB',
    data: 'oc',
  },

  {
    from: 'l',
    fid: '0xE',
    to: 'r',
    tid: '0xY',
    data: 'block',
  },
  {
    from: 'l',
    fid: '0xE',
    to: 'r',
    tid: '0xZ',
    data: 'block',
  },
  {
    from: 'l',
    fid: '0xE',
    to: 'f3',
    tid: '0xD',
    data: 'lc',
  },
];

function formatLog(log, index) {
  const timestamp = Date.now() + index; // Adds the index to ensure uniqueness
  const fields = `from="${log.from}",to="${log.to}",fid="${log.fid}",tid="${log.tid}",data="${log.data}"`;
  return `logEntry ${fields} ${timestamp}`;
}

const lineProtocolData = logs.map(formatLog).join('\n');

// console.log(lineProtocolData);
async function postData() {
  const precision = 'ms';

  try {
    const response = await axios.post(
      `${url}/api/v2/write?org=${org}&bucket=${bucket}&precision=${precision}`,
      lineProtocolData,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'text/plain; charset=utf-8',
          Accept: 'application/json',
        },
      }
    );
    console.log('Data posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting data:', error);
  }
}

postData();

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

const query = `
from(bucket: "logylman")
  |> range(start: -1d)
  |> filter(fn: (r) => r._measurement == "logEntry")
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
`;

async function queryData() {
  console.log('--- QUERY DATA ---');
  queryApi.queryRows(query, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      console.log(JSON.stringify(o, null, 2));
    },
    error(error) {
      console.error('QUERY ERROR', error);
    },
    complete() {
      console.log('Query completed');
    },
  });
}

queryData();
