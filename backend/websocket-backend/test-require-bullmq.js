try {
  const b = require('bullmq');
  console.log('required bullmq ok, Worker type:', typeof b.Worker);
} catch (e) {
  console.error('require bullmq failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
