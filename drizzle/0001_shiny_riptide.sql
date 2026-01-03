CREATE TABLE `creatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nicho` text NOT NULL,
	`publico` text NOT NULL,
	`objetivo` varchar(50) NOT NULL,
	`consciencia` varchar(50) NOT NULL,
	`tom` varchar(50) NOT NULL,
	`headline` text NOT NULL,
	`textoAnuncio` text NOT NULL,
	`cta` text NOT NULL,
	`anguloEmocional` text NOT NULL,
	`ideiaCreativo` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creatives_id` PRIMARY KEY(`id`)
);
