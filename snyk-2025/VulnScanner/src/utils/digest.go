package utils

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

func SignTemplate(content string) (string, string, error) {
	normalizedContent := NormalizeContent(content)
	hash := sha256.Sum256([]byte(normalizedContent))
	hexHash := fmt.Sprintf("%x", hash)
	signedTemplate := fmt.Sprintf("%s\n# digest: %s\n", content, hexHash)
	return signedTemplate, hexHash, nil
}

func WriteDigest(digestFile, digest string) error {
	digestFileHandle, err := os.OpenFile(digestFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return fmt.Errorf("failed to open known_digests.txt for appending: %w", err)
	}
	defer digestFileHandle.Close()

	_, err = digestFileHandle.WriteString(fmt.Sprintf("%s\n", digest))
	if err != nil {
		return fmt.Errorf("failed to write digest: %w", err)
	}

	return nil
}

func VerifyDigest(content, digestFile string) (bool, error) {
	digestPattern := regexp.MustCompile(`(?m)^#\sdigest:\s([a-fA-F0-9]+)`)
	matches := digestPattern.FindAllStringSubmatch(content, 1) // Only match the first line

	if len(matches) == 0 {
		return false, errors.New("no valid digest found")
	}

	firstDigest := matches[0][1]
	cleanedContent := RemoveDigestComment(content)
	normalizedContent := NormalizeContent(cleanedContent)
	hash := sha256.Sum256([]byte(normalizedContent))
	hexHash := fmt.Sprintf("%x", hash)

	_, err := ioutil.ReadFile(digestFile)
	if err != nil {
		return false, fmt.Errorf("failed to read known digests: %w", err)
	}

	if strings.TrimSpace(hexHash) == firstDigest {
		return true, nil
	}
	return false, errors.New("signature verification failed")
}

func RemoveDigestComment(content string) string {
	lines := strings.Split(content, "\n")
	var cleanedLines []string
	for _, line := range lines {
		if !strings.HasPrefix(strings.TrimSpace(line), "# digest:") {
			cleanedLines = append(cleanedLines, line)
		}
	}
	cleanedContent := strings.Join(cleanedLines, "\n")
	return cleanedContent
}

func NormalizeContent(content string) string {
	var yamlContent interface{}
	err := yaml.Unmarshal([]byte(content), &yamlContent)
	if err != nil {
		return content
	}

	normalizedContent, err := yaml.Marshal(yamlContent)
	if err != nil {
		return content
	}
	normalizedContentStr := strings.TrimSpace(string(normalizedContent))
	return normalizedContentStr
}
