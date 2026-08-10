import express from 'express';
const app = express();
app.get('/:shortCode', (req, res) => res.send('matched params ' + req.params.shortCode));
app.use((req, res) => res.send('fallback'));
app.listen(3001, async () => {
  const res = await fetch('http://localhost:3001/');
  console.log(await res.text());
  process.exit();
});
