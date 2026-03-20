try {
  const b = await import('bullmq');
  console.log('imported bullmq ok, Worker type:', typeof b.Worker);
} catch (e) {
  console.error('import bullmq failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
