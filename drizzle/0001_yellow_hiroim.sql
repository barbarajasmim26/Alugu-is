CREATE TABLE `arquivos_contrato` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`nomeArquivo` varchar(255) NOT NULL,
	`urlArquivo` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`tamanho` int,
	`mimeType` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `arquivos_contrato_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contratos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propriedadeId` int NOT NULL,
	`casa` varchar(20) NOT NULL,
	`nomeInquilino` varchar(255) NOT NULL,
	`dataEntrada` date,
	`dataSaida` date,
	`caucao` decimal(10,2),
	`aluguel` decimal(10,2) NOT NULL,
	`diaPagamento` int,
	`status` enum('ativo','encerrado','pendente') NOT NULL DEFAULT 'ativo',
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contratos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pagamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`ano` int NOT NULL,
	`mes` int NOT NULL,
	`status` enum('pago','caucao','pendente','atrasado') NOT NULL DEFAULT 'pendente',
	`valorPago` decimal(10,2),
	`dataPagamento` date,
	`observacao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propriedades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`endereco` varchar(500) NOT NULL,
	`cidade` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `propriedades_id` PRIMARY KEY(`id`)
);
