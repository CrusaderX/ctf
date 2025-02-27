package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
)

func HandleTemplates(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/templates.html")
}

func HandleTemplateList(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/templatelist.html")
}

func HandleTemplateDownload(w http.ResponseWriter, r *http.Request) {
	templateName := r.URL.Path[len("/templates/download/"):]
	filePath := filepath.Join("./templates", templateName)

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Template not found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, filePath)
}

func HandleKnownDigests(w http.ResponseWriter, r *http.Request) {
	filePath := "./templates/known_digests.txt"

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Known digests file not found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, filePath)
}

func HandleTemplateListJSON(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir("./templates")
	if err != nil {
		http.Error(w, "Error reading templates directory", http.StatusInternalServerError)
		return
	}

	var templateNames []string
	for _, file := range files {
		if !file.IsDir() {
			templateNames = append(templateNames, file.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		Templates []string `json:"templates"`
	}{Templates: templateNames})
}
