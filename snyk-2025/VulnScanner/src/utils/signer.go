package utils

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

func RunSigner(inputDir, outputDir, digestFile string) error {
	err := os.MkdirAll(outputDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	files, err := ioutil.ReadDir(inputDir)
	if err != nil {
		return fmt.Errorf("failed to read input directory: %w", err)
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		inputPath := filepath.Join(inputDir, file.Name())
		outputPath := filepath.Join(outputDir, file.Name())

		content, err := ioutil.ReadFile(inputPath)
		if err != nil {
			fmt.Printf("Failed to read template %s: %v\n", inputPath, err)
			continue
		}

		signedTemplate, digest, err := SignTemplate(string(content))
		if err != nil {
			fmt.Printf("Failed to sign template %s: %v\n", inputPath, err)
			continue
		}

		err = ioutil.WriteFile(outputPath, []byte(signedTemplate), 0644)
		if err != nil {
			fmt.Printf("Failed to write signed template %s: %v\n", outputPath, err)
			continue
		}

		err = WriteDigest(digestFile, digest)
		if err != nil {
			fmt.Printf("Failed to write digest for template %s: %v\n", inputPath, err)
			continue
		}

		fmt.Printf("Signed template written to: %s\n", outputPath)
	}

	return nil
}
