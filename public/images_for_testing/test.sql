CREATE TABLE `Ishchiler` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ad` varchar(120),
  `soyad` varchar(120),
  `dogum_tarixi` date
);

CREATE TABLE `Maash` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `miqdar` double(10,2) NOT NULL,
  `ishchi_id` int NOT NULL
);

CREATE TABLE `Adres` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `adres` text,
  `ishchi_id` int
);

ALTER TABLE `Maash` ADD FOREIGN KEY (`ishchi_id`) REFERENCES `Ishchiler` (`id`);

ALTER TABLE `Adres` ADD FOREIGN KEY (`ishchi_id`) REFERENCES `Ishchiler` (`id`);
