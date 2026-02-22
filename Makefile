.PHONY: help clean dev test

help:
	@printf "Available targets:\n"
	@printf "  make help   Show this help.\n"
	@printf "  make dev    Start development environment (docker compose up).\n"
	@printf "  make clean  Remove generated _site directory.\n"
	@printf "  make test   Run Playwright UI tests in Docker.\n"

clean:
	rm -rf _site

dev:
	docker compose up

test:
	@printf "\n[ui-test] Running Playwright UI tests in Docker...\n"
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
