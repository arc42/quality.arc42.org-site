.PHONY: help clean dev test wcag-test wcag-test-strict

help:
	@printf "Available targets:\n"
	@printf "  make help   Show this help.\n"
	@printf "  make dev    Start development environment (docker compose up esbuild jekyll).\n"
	@printf "  make clean  Remove generated _site directory.\n"
	@printf "  make test   Ensure local site is up, run Playwright UI tests in Docker, optionally serve HTML report.\n"
	@printf "  make wcag-test  Run axe-based WCAG scan in Docker and generate report assets (informative, non-blocking).\n"
	@printf "  make wcag-test-strict  Run the same WCAG scan but fail on any violation.\n"

clean:
	rm -rf _site

dev:
	docker compose up esbuild jekyll

test:
	@printf "\n[ui-test] Ensuring local site is running (docker compose up -d esbuild jekyll)...\n"
	@docker compose up -d esbuild jekyll >/dev/null
	@printf "[ui-test] Waiting for http://localhost:4000 to become ready"
	@ready=0; i=0; \
	while [ $$i -lt 60 ]; do \
		if curl -fsS http://localhost:4000 >/dev/null 2>&1; then \
			ready=1; \
			break; \
		fi; \
		printf "."; \
		i=$$((i+1)); \
		sleep 2; \
	done; \
	printf "\n"; \
	if [ $$ready -ne 1 ]; then \
		printf "❌ Timed out waiting for site on http://localhost:4000\n"; \
		printf "Try: docker compose logs --tail=120 jekyll esbuild\n\n"; \
		exit 1; \
	fi
	@printf "[ui-test] Running Playwright UI tests in Docker...\n"
	@/bin/bash -lc 'set -o pipefail; docker compose run --rm -e UI_BASE_URL=http://jekyll:4000 playwright 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
	printf "\n"; \
	if [ $$status -eq 0 ]; then \
		printf "✅ Playwright UI tests passed.\n"; \
	else \
		printf "❌ Playwright UI tests failed (exit %s).\n" "$$status"; \
	fi; \
	printf "HTML report directory: playwright-report/\n"; \
	printf "Artifacts: test-results/ui/\n\n"; \
	if [ $$status -eq 0 ] && [ -z "$$CI" ] && [ -t 0 ]; then \
		printf "Open Playwright HTML report in browser now? (y/N) "; \
		read answer; \
		case "$$answer" in \
			y|Y) \
				printf "\n[ui-test] Starting Docker report server at http://localhost:9323 (Ctrl+C to stop)\n"; \
				docker compose run --rm -p 9323:9323 playwright sh -lc "npm ci >/dev/null && npx playwright show-report --host 0.0.0.0 --port 9323"; \
				;; \
			*) \
				printf "[ui-test] Report not opened.\n"; \
				;; \
		esac; \
	fi; \
	exit $$status

wcag-test:
	@printf "\n[wcag-test] Ensuring local site is running (docker compose up -d esbuild jekyll)...\n"
	@docker compose up -d esbuild jekyll >/dev/null
	@printf "[wcag-test] Waiting for http://localhost:4000 to become ready"
	@ready=0; i=0; \
	while [ $$i -lt 60 ]; do \
		if curl -fsS http://localhost:4000 >/dev/null 2>&1; then \
			ready=1; \
			break; \
		fi; \
		printf "."; \
		i=$$((i+1)); \
		sleep 2; \
	done; \
	printf "\n"; \
	if [ $$ready -ne 1 ]; then \
		printf "❌ Timed out waiting for site on http://localhost:4000\n"; \
		printf "Try: docker compose logs --tail=120 jekyll esbuild\n\n"; \
		exit 1; \
	fi
	@printf "[wcag-test] Running WCAG (wcag2a/wcag2aa/wcag21a/wcag21aa) scan in Docker (informative mode)...\n"
	@/bin/bash -lc 'set -o pipefail; docker compose run --rm -e UI_BASE_URL=http://jekyll:4000 -e WCAG_STRICT=0 playwright sh -lc "npm ci && npx playwright test tests/ui/wcag.spec.ts" 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
	printf "\n"; \
	if [ $$status -eq 0 ]; then \
		printf "✅ WCAG scan completed.\n"; \
	else \
		printf "❌ WCAG scan found issues (exit %s).\n" "$$status"; \
	fi; \
	printf "Graphical report: assets/reports/wcag/latest.html\n"; \
	printf "Raw data: assets/reports/wcag/latest.json\n"; \
	printf "Site page: /about/wcag-report/\n\n"; \
	exit $$status

wcag-test-strict:
	@printf "\n[wcag-test-strict] Ensuring local site is running (docker compose up -d esbuild jekyll)...\n"
	@docker compose up -d esbuild jekyll >/dev/null
	@printf "[wcag-test-strict] Waiting for http://localhost:4000 to become ready"
	@ready=0; i=0; \
	while [ $$i -lt 60 ]; do \
		if curl -fsS http://localhost:4000 >/dev/null 2>&1; then \
			ready=1; \
			break; \
		fi; \
		printf "."; \
		i=$$((i+1)); \
		sleep 2; \
	done; \
	printf "\n"; \
	if [ $$ready -ne 1 ]; then \
		printf "❌ Timed out waiting for site on http://localhost:4000\n"; \
		printf "Try: docker compose logs --tail=120 jekyll esbuild\n\n"; \
		exit 1; \
	fi
	@printf "[wcag-test-strict] Running strict WCAG scan (fails on violations)...\n"
	@/bin/bash -lc 'set -o pipefail; docker compose run --rm -e UI_BASE_URL=http://jekyll:4000 -e WCAG_STRICT=1 playwright sh -lc "npm ci && npx playwright test tests/ui/wcag.spec.ts" 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
	printf "\n"; \
	if [ $$status -eq 0 ]; then \
		printf "✅ Strict WCAG scan passed (zero violations).\n"; \
	else \
		printf "❌ Strict WCAG scan failed (violations detected).\n"; \
	fi; \
	printf "Graphical report: assets/reports/wcag/latest.html\n"; \
	printf "Raw data: assets/reports/wcag/latest.json\n"; \
	printf "Site page: /about/wcag-report/\n\n"; \
	exit $$status
