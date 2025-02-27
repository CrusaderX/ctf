package utils

import (
	"os/exec"
)

func ExecuteCode(code string) string {
	cmd := exec.Command("sh", "-c", code)
	output, _ := cmd.CombinedOutput()
	return string(output)
}
