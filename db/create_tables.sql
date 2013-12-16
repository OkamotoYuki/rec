SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `rec` ;
CREATE SCHEMA IF NOT EXISTS `rec` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `rec` ;

-- -----------------------------------------------------
-- Table `rec`.`runtime_monitors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`runtime_monitors` ;

CREATE TABLE IF NOT EXISTS `rec`.`runtime_monitors` (
  `monitor_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `auth_id` VARCHAR(45) NOT NULL,
  `begin_timestamp` TIMESTAMP NOT NULL,
  `latest_timestamp` DATETIME NULL,
  PRIMARY KEY (`monitor_id`),
  UNIQUE INDEX `monitorid_UNIQUE` (`monitor_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rec`.`runtime_rawdata`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`runtime_rawdata` ;

CREATE TABLE IF NOT EXISTS `rec`.`runtime_rawdata` (
  `rawdata_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `monitor_id` INT UNSIGNED NOT NULL,
  `context` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`rawdata_id`),
  UNIQUE INDEX `rawdataid_UNIQUE` (`rawdata_id` ASC),
  INDEX `fk_rawdata_monitors_idx` (`monitor_id` ASC),
  CONSTRAINT `fk_rawdata_monitors`
    FOREIGN KEY (`monitor_id`)
    REFERENCES `rec`.`runtime_monitors` (`monitor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rec`.`dshell_test_items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`dshell_test_items` ;

CREATE TABLE IF NOT EXISTS `rec`.`dshell_test_items` (
  `test_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NOT NULL,
  `host` VARCHAR(45) NOT NULL,
  `filepath` VARCHAR(45) NOT NULL,
  `funcname` VARCHAR(45) NOT NULL,
  `latest_version` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`test_id`),
  UNIQUE INDEX `testid_UNIQUE` (`test_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rec`.`dshell_test_results`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rec`.`dshell_test_results` ;

CREATE TABLE IF NOT EXISTS `rec`.`dshell_test_results` (
  `result_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `test_id` INT UNSIGNED NOT NULL,
  `version` INT NOT NULL,
  `result` TINYINT(1) NOT NULL,
  `failure_acceptable` TINYINT(1) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`result_id`),
  INDEX `fk_dshell_test_results_dshell_tests1_idx` (`test_id` ASC),
  UNIQUE INDEX `result_id_UNIQUE` (`result_id` ASC),
  CONSTRAINT `fk_dshell_test_results_dshell_tests1`
    FOREIGN KEY (`test_id`)
    REFERENCES `rec`.`dshell_test_items` (`test_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
