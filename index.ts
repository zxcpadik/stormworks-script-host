import express from 'express';
import * as Script from './scripts/test-script'

const app = express();

app.get('/test', async (req, res) => {
  let ok = Script.Input.Parse(req.query['data'] as string);
  Script.Screen.Parse(req.query['data'] as string);
  if (!ok) return;
  await Script.onTick();
  let data = Script.Output.ToString() + Script.Screen.ToString();
  res.send(data);
});

const port = 8080;
app.listen({ port: 8080 }, () => {
  console.log(`Server started on port ${port}`);
});