.PHONY: help clean dev test

help:
	@printf "Available targets:\n"
	@printf "  make help   Show this help.\n"
	@printf "  make dev    Start development environment (docker compose up).\n"
	@printf "  make clean  Remove generated _site directory.\n"
	@printf "  make test   Ensure local site is up, then run Playwright UI tests in Docker.\n"

clean:
	rm -rf _site

dev:
	docker compose up

test:
	@printf "\n[ui-test] Ensuring local site is running (docker compose up -d)...\n"
	@docker compose up -d >/dev/null
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
	@npm run test:ui; status=$$?; \
	printf "\n"; \
	if [ $$status -eq 0 ]; then \
		printf "✅ Playwright UI tests passed.\n"; \
	else \
		printf "❌ Playwright UI tests failed (exit %s).\n" "$$status"; \
	fi; \
	printf "Report: playwright-report/index.html\n"; \
	printf "Artifacts: test-results/ui/\n\n"; \
	exit $$status
