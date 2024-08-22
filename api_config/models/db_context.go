package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const databaseFilename = "database.db3"

func Init() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(databaseFilename), &gorm.Config{})
	if err != nil {
		panic("Couldn't open the database!")
	}

	addEntities(db)

	return db
}

func addEntities(database *gorm.DB) {
	database.AutoMigrate(
		&User{},
		&Project{},
		&Task{},
	)
}
