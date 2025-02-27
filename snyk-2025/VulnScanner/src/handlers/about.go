package handlers

import (
	"net/http"
)

func HandleAbout(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/about.html")
}
