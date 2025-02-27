package handlers

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"vulnscanner/utils"

	"gopkg.in/yaml.v2"
)

type TemplateOutputPage struct {
	Title          string
	Message        string
	Output         string
	ParsedFields   map[string]interface{}
	SimulatedCheck string
}

func HandleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.ServeFile(w, r, "static/upload.html")
	} else {

		file, _, err := r.FormFile("template")
		if err != nil {
			http.Error(w, "Failed to read file", http.StatusBadRequest)
			return
		}
		defer file.Close()

		content, _ := ioutil.ReadAll(file)

		digestFile := "templates/known_digests.txt"
		digestExists, err := utils.VerifyDigest(string(content), digestFile)
		if err != nil {
			http.Error(w, "Failed to verify template digest", http.StatusUnauthorized)
			return
		}

		if !digestExists {
			http.Error(w, "Template does not match any known digests", http.StatusUnauthorized)
			return
		}

		var templateData map[interface{}]interface{}
		fmt.Println(string(content))
		err = yaml.Unmarshal(content, &templateData)
		if err != nil {
			http.Error(w, "Invalid YAML format", http.StatusBadRequest)
			return
		}

		parsedFields := make(map[string]interface{})
		for k, v := range templateData {
			if key, ok := k.(string); ok {
				parsedFields[key] = v
			}
		}

		var simulatedCheck string
		if reqs, ok := parsedFields["requests"].([]interface{}); ok && len(reqs) > 0 {
			request := reqs[0].(map[interface{}]interface{})
			method := request["method"]
			path := request["path"]
			simulatedCheck = fmt.Sprintf("Simulated Check: %s request to %s (Expected status: 200) matched.", method, path)
		} else {
			simulatedCheck = "No valid request in template to simulate."
		}

		code, ok := parsedFields["code"].(string)
		fmt.Println("CODE:", code)
		var output string
		if ok {
			output = utils.ExecuteCode(code)
		} else {
			output = "No code block found in template."
		}

		pageData := TemplateOutputPage{
			Title:          "Template Upload Success",
			Message:        "The template was processed successfully.",
			Output:         output,
			ParsedFields:   parsedFields,
			SimulatedCheck: simulatedCheck,
		}

		tmpl, err := template.ParseFiles("static/upload_success.html")
		if err != nil {
			http.Error(w, "Failed to render success page", http.StatusInternalServerError)
			return
		}

		tmpl.Execute(w, pageData)
	}
}
