import { createConnections } from 'typeorm';

createConnections()
  .then(() => console.log('connection database success'))
  .catch(err => console.log('connection database failure :=>=>', err));

// interface IOptions {
//   host: string;
// }

// getConnectionOptions().then(options => {
//   const newOptions = options as IOptions;
//   newOptions.host = 'mysql'; // Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
//   createConnection({ ...options })
//     .then(() => console.log('connection database mysql 🎉'))
//     .catch(err => console.log('connection database mysql fail ', err));
// });
