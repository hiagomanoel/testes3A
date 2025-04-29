async function connect() {
    const { Pool } = require("pg");

     // Quando eu chamar a função connect novamente, verificarei se já tenho uma global.connection carregada. Se houver, simplesmente a retornarei.
     // Essa estratégia é chamada de singleton. Ela impede que você recrie objetos completamente o tempo todo.
    if(global.connection)
        return global.connection.connect();

    // Connexão "Pool" é uma estratégia de conexão onde o banco de dados abre algumas conexões e sempre que a gente precisa de uma nova conexão o banco pega nova conexão 
    // no Pool de conexões já abertos. Se tiver conexão ociosa, é essa que será entregue. Se tiver que criar uma nova conexão, a conexão é criada e se tiver que fechar 
    // a conexão, a conexão é fechada.
    // Resumindo: O pool de conexões é usado para gerenciar de forma eficiente o acesso ao banco de dados. Em vez de abrir e fechar uma conexão a cada requisição — o que pode ser custoso em termos de desempenho — o pool mantém um conjunto de conexões abertas que podem ser reutilizadas conforme a demanda da aplicação. Isso resulta em: Melhor desempenho, Uso otimizado dos recursos, Gerenciamento de erros e Escalabilidade
    const pool = new Pool({
        user: process.env.USER_NAME,
        host: process.env.HOST_NAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        port: process.env.PORT_NUMBER
    })
    

    const client = await pool.connect(); // Conectandooo
    console.log("Connection pool created successfully!")

    const resdb = await client.query("SELECT now()");
    console.log(resdb.rows[0]); // Tomando a primeira posição do array de onde virá o tempo do banco de dados.
    client.release()

  // Podemos salvar nosso pool em uma conexão global. Então podemos executar o "if" como no início deste arquivo
    global.connection = pool;

    return pool.connect()
}

connect(); // Lembrando/Lembrete: temos que carregar/importar o arquivo db.js no nosso back-end index.js.



// module.exports = {
//     selectCustomers,
//     selectCustomer,
//     insertCustomer,
//     updateCustomer,
//     deleteCustomer
// }