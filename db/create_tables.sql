SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `rec` ;
CREATE SCHEMA IF NOT EXISTS `rec` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `rec` ;

-- -----------------------------------------------------
-- Table `rec`.`assurenote_monitor_items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`assurenote_monitor_items` ;

CREATE TABLE IF NOT EXISTS `rec`.`assurenote_monitor_items` (
  `monitor_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `auth_id` VARCHAR(45) NOT NULL,
  `latest_data_id` INT UNSIGNED NULL,
  `begin_timestamp` DATETIME NOT NULL,
  `latest_timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`monitor_id`),
  UNIQUE INDEX `monitorid_UNIQUE` (`monitor_id` ASC),
  UNIQUE INDEX `latest_data_id_UNIQUE` (`latest_data_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rec`.`assurenote_monitor_rawdata`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`assurenote_monitor_rawdata` ;

CREATE TABLE IF NOT EXISTS `rec`.`assurenote_monitor_rawdata` (
  `rawdata_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `monitor_id` INT UNSIGNED NOT NULL,
  `data` INT NOT NULL,
  `context` VARCHAR(45) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`rawdata_id`),
  UNIQUE INDEX `rawdataid_UNIQUE` (`rawdata_id` ASC),
  INDEX `fk_rawdata_monitors_idx` (`monitor_id` ASC),
  CONSTRAINT `fk_rawdata_monitors`
    FOREIGN KEY (`monitor_id`)
    REFERENCES `rec`.`assurenote_monitor_items` (`monitor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rec`.`dshell_test_envs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`dshell_test_envs` ;

CREATE TABLE IF NOT EXISTS `rec`.`dshell_test_envs` (
  `env_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NOT NULL,
  `host` VARCHAR(45) NOT NULL,
  `version` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`env_id`),
  UNIQUE INDEX `testid_UNIQUE` (`env_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rec`.`dshell_test_results`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`dshell_test_results` ;

CREATE TABLE IF NOT EXISTS `rec`.`dshell_test_results` (
  `result_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `env_id` INT UNSIGNED NOT NULL,
  `funcname` VARCHAR(45) NOT NULL,
  `result` TINYINT(1) NOT NULL,
  `ignorable` TINYINT(1) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`result_id`),
  INDEX `fk_dshell_test_results_dshell_tests1_idx` (`env_id` ASC),
  UNIQUE INDEX `result_id_UNIQUE` (`result_id` ASC),
  CONSTRAINT `fk_dshell_test_results_dshell_tests1`
    FOREIGN KEY (`env_id`)
    REFERENCES `rec`.`dshell_test_envs` (`env_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
