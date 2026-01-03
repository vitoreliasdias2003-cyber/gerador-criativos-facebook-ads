CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`productName` text NOT NULL,
	`sourceUrl` varchar(500),
	`sourceType` varchar(50) NOT NULL,
	`targetAudience` text NOT NULL,
	`mainPain` text NOT NULL,
	`mainBenefit` text NOT NULL,
	`centralPromise` text NOT NULL,
	`communicationTone` varchar(50) NOT NULL,
	`headline` text NOT NULL,
	`textoAnuncio` text NOT NULL,
	`cta` text NOT NULL,
	`anguloEmocional` text NOT NULL,
	`ideiaCreativo` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
