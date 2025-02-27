package main

import (
	"fmt"
	"net/http"
	"os"
	"vulnscanner/handlers"
	"vulnscanner/utils"
)

func main() {
	rawDir := "./raw_templates"
	templatesDir := "./templates"
	digestFile := "./templates/known_digests.txt"

	err := utils.RunSigner(rawDir, templatesDir, digestFile)
	if err != nil {
		fmt.Printf("Error running signer: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Templates signed and digests saved successfully.")

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	handlers.RegisterRoutes()

	fmt.Println("Starting web server...\n===========================================")
	err = http.ListenAndServe(":8081", nil)
	if err != nil {
		fmt.Printf("Error starting web server: %v\n", err)
		os.Exit(1)
	}
}
