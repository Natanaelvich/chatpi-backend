import { createConnections } from 'typeorm';

createConnections()
  .then(() => console.log('connection database success'))
  .catch(err => console.log('connection database failure', err));
