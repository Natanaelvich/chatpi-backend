import {
  createConnection,
  createConnections,
  getConnectionOptions,
} from 'typeorm';

if (process.env.TS_NODE_DEV) {
  interface IOptions {
    host: string;
  }

  getConnectionOptions().then(options => {
    const newOptions = options as IOptions;
    newOptions.host = 'mysql'; // Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
    createConnection({ ...options })
      .then(() => console.log('connection database mysql 🎉'))
      .catch(err => console.log('connection database mysql fail ', err));
  });
} else {
  createConnections()
    .then(() => console.log('connection database success'))
    .catch(err => console.log('connection database failure:', err));
}
