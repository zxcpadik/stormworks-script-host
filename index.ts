import express from 'express';
import { GameBridge, GameDrawBridge, SWScript } from './stormworks-types';

const port = 8080; // You can chage server's port, don't forget to change it in game script
import * as TestScript from './scripts/test-script' // Import your chip as in example
// import * as NewScript from './scripts/new-script'
const Scripts: SWScript[] = [
  TestScript,
  // NewScript,
] // And add it to listener

const app = express();

let c = 0;
let cl = 0;
setInterval(() => {
  let diff = c - cl;
  cl = c;
  console.log(`[TPS] Avg 1 min: ${(diff / 60).toFixed(1)}`);
}, 60000);

app.get('/*', async (req, res) => {
  let ChipID = req.path.split('/')[1]!;
  let Script = Scripts.find(x => x.ChipID.toLowerCase() === ChipID.toLowerCase());
  if (!Script) return res.sendStatus(404);

  c++;
  let ok = Script.Input.Parse(req.query['data'] as string);
  Script.Screen.Parse(req.query['data'] as string);
  if (!ok) return;

  await Script.onTick();

  let data = Script.Output.ToString() + Script.Screen.ToString();
  //console.log(`[DATA] Sent ${(data.length / 1024).toFixed(1)}kB`);
  res.send(data);
});
app.listen({ port: 8080 }, () => {
  console.log(`Server started on port ${port}`);
});

// Stormworks remote script server
//
// Source: https://github.com/zxcpadik/stormworks-script-host
// Author: @zxcpadik