package utils

import (
	"gopkg.in/yaml.v3"
)

func ParseYAML(content []byte) (map[string]interface{}, error) {
	var data map[string]interface{}
	err := yaml.Unmarshal(content, &data)
	return data, err
}
