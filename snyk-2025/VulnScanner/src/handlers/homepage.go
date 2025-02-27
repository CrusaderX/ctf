package handlers

import (
	"net/http"
)

func HandleHomepage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/index.html")
}
