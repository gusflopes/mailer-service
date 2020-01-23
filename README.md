# Microservice Mailer

## Definindo o MVP
Objetivo (MVP): Enviar emails para uma lista de forma fácil

### Requisitos Funcionais
- Importar uma lista em CSV e relacionar ela com uma tag;
- Enviar mensagem para uma ou mais tags;
- Listar inscritos em uma ou mais tags;
- Visualização do progresso de envio (concluído/não concluído);

### Requisitos Não Funcionais
- Utilizar Amazon SES para envio de email ($1 para aprox. 10 mil emails);
- Utilizar MongoDB;
- Utilizar Express;
- Utilizar algum serviço de mensageria (Kafka: mais complexo; ou Redis: menos complexo);

### Regras de negócio
- Na importação, se a tag não existir ela deve ser criada;
- Na importação, se o usuário já existir, só vamos veicula-lo com a tag;
- A importação deve permitir múltiplas tags;

## Desenvolvimento
Lorem ipsum

### ???
Lorem ipsum