package handlers

import (
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("/", HandleHomepage)
	http.HandleFunc("/upload", HandleUpload)
	http.HandleFunc("/about", HandleAbout)
	http.HandleFunc("/templates/", HandleTemplates)
	http.HandleFunc("/templates/download/", HandleTemplateDownload)
	http.HandleFunc("/templates/list", HandleTemplateList)
	http.HandleFunc("/templates/list/json", HandleTemplateListJSON)
	http.HandleFunc("/templates/known_digests.txt", HandleKnownDigests)
}
