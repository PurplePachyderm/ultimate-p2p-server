CREATE TABLE `users` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `faName` varchar(45) NOT NULL,
  `fiName` varchar(45) NOT NULL,
  `pseudo` varchar(50) DEFAULT NULL,
  `email` varchar(70) NOT NULL,
  `password` varchar(128) NOT NULL,
  `inscriptionDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE `files` (
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(128) NOT NULL,
	`description` TEXT,
	`weight` SMALLINT unsigned,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
