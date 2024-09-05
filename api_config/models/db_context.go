package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Init(filename string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(filename), &gorm.Config{})
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
