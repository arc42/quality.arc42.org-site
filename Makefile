.PHONY: help build clean dev down doctor diagnose test wcag-test wcag-test-strict lighthouse-test assets

help:
	@printf "Available targets:\n"
	@printf "  make build         Build all Docker images used by local development and tests.\n"
	@printf "  make assets        Build minified production assets (JS/search index) via Docker.\n"
	@printf "  make help          Show this help.\n"
	@printf "  make dev           Start the prebuilt development environment (docker compose up esbuild jekyll).\n"
	@printf "  make down          Stop and remove dev containers + network. Preserves cache volumes.\n"
	@printf "  make doctor        Check local dev setup and key URLs (including alias redirects).\n"
	@printf "  make diagnose      Read-only health snapshot (Docker daemon, stack state, port 4000, HTTP probe).\n"
	@printf "  make clean         Remove generated _site directory AND cache volumes.\n"
	@printf "  make test          Ensure local site is up, run Playwright UI tests in Docker, optionally serve HTML report.\n"
	@printf "  make wcag-test     Run axe-based WCAG scan in Docker and generate report assets (informative, non-blocking).\n"
	@printf "  make wcag-test-strict  Run the same WCAG scan but fail on any violation.\n"
	@printf "  make lighthouse-test  Run Lighthouse performance/SEO audits in Docker (informative).\n"

build:
	docker compose --profile test build esbuild jekyll playwright

assets:
	docker compose run --rm esbuild npm run build

clean:
	docker compose down --volumes 2>/dev/null || true
	chmod -RN _site 2>/dev/null || true
	rm -rf _site
	rm -f assets/.esbuild-ready

dev:
	docker compose up esbuild jekyll

down:
	@printf "\n[down] Stopping and removing dev containers + network (preserving cache volumes)...\n"
	@docker compose down
	@printf "[down] Done. Run 'make dev' to start again, or 'make clean' to also wipe cache volumes.\n\n"

diagnose:
	@printf "\n[diagnose] Local dev stack health snapshot\n\n"
	@if ! docker info >/dev/null 2>&1; then \
		printf "  [fail] Docker daemon: not reachable.\n"; \
		printf "         Start Docker Desktop (or the docker daemon) and try again.\n\n"; \
		exit 1; \
	fi
	@printf "  [ok]   Docker daemon: reachable\n"
	@printf "\n  --- Compose stack ---\n"
	@if [ -z "$$(docker compose ps -q 2>/dev/null)" ]; then \
		printf "  [warn] No services running for this compose project.\n"; \
		printf "         Run 'make dev' to start the stack.\n\n"; \
		exit 0; \
	fi
	@docker compose ps --format 'table {{.Service}}\t{{.State}}\t{{.Status}}\t{{.Ports}}' 2>&1 | sed 's/^/         /'
	@printf "\n  --- Port 4000 publishing (container side) ---\n"
	@jekyll_id=$$(docker compose ps -q jekyll 2>/dev/null); \
	if [ -z "$$jekyll_id" ]; then \
		printf "  [warn] Jekyll service not in the running stack.\n"; \
	else \
		ports=$$(docker inspect "$$jekyll_id" --format '{{json .NetworkSettings.Ports}}' 2>/dev/null); \
		if echo "$$ports" | grep -q '"HostPort"'; then \
			printf "  [ok]   Jekyll container: port 4000 published to host\n"; \
		else \
			printf "  [fail] Jekyll container: port 4000 NOT published to host\n"; \
			printf "         Container has stale config (docker-compose.yml edited after start).\n"; \
			printf "         Fix: make down && make dev\n"; \
		fi; \
	fi
	@printf "\n  --- Host network (port 4000) ---\n"
	@listener=$$(lsof -nP -iTCP:4000 -sTCP:LISTEN 2>/dev/null); \
	if [ -z "$$listener" ]; then \
		printf "  [fail] Nothing listening on host port 4000.\n"; \
		printf "         If the container shows it as published, restart Docker Desktop.\n"; \
	else \
		printf "  [ok]   Host port 4000: in use\n"; \
		non_docker=$$(printf "%s\n" "$$listener" | awk 'NR>1 && tolower($$1) !~ /docker|com.docke|vpnkit/'); \
		if [ -n "$$non_docker" ]; then \
			printf "  [warn] A non-Docker process is also bound to port 4000:\n"; \
			printf "%s\n" "$$non_docker" | head -3 | sed 's/^/         /'; \
		fi; \
	fi
	@printf "\n  --- HTTP probe ---\n"
	@code=$$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" http://localhost:4000/ 2>/dev/null || echo "000"); \
	case "$$code" in \
		200) printf "  [ok]   GET http://localhost:4000/ -> 200\n";; \
		000) printf "  [fail] GET http://localhost:4000/ -> connection refused or timeout\n";; \
		*)   printf "  [warn] GET http://localhost:4000/ -> HTTP %s\n" "$$code";; \
	esac
	@printf "\n[diagnose] Done. For deeper investigation:\n"
	@printf "  docker compose logs --tail=60 jekyll esbuild\n\n"

doctor:
	@printf "\n[doctor] Checking local prerequisites...\n"
	@if ! command -v docker >/dev/null 2>&1; then \
		printf "❌ docker not found in PATH.\n"; \
		exit 1; \
	fi
	@if ! docker compose version >/dev/null 2>&1; then \
		printf "❌ docker compose is not available.\n"; \
		exit 1; \
	fi
	@printf "[doctor] Ensuring dev services are running (docker compose up -d esbuild jekyll)...\n"
	@docker compose up -d esbuild jekyll >/dev/null
	@printf "[doctor] Waiting for http://localhost:4000 to become ready"
	@ready=0; i=0; \
	while [ $$i -lt 45 ]; do \
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
		printf "❌ Site did not become ready on http://localhost:4000\n"; \
		printf "Run: docker compose logs --tail=120 jekyll esbuild\n"; \
		printf "Also verify no other process is using port 4000.\n"; \
		exit 1; \
	fi
	@printf "[doctor] Probing key routes...\n"
	@fail=0; \
	for path in "/" "/qualities/autonomy/" "/qualities/autonomicity/" ; do \
		url="http://localhost:4000$$path"; \
		code=$$(curl -s -o /dev/null -w "%{http_code}" "$$url" || true); \
		if [ "$$code" = "200" ] || [ "$$code" = "301" ] || [ "$$code" = "302" ]; then \
			printf "  [ok]   %s -> HTTP %s\n" "$$path" "$$code"; \
		else \
			printf "  [fail] %s -> HTTP %s\n" "$$path" "$$code"; \
			fail=1; \
		fi; \
	done; \
	if [ $$fail -ne 0 ]; then \
		printf "\n❌ Route check failed.\n"; \
		printf "Run: docker compose logs --tail=120 jekyll esbuild\n"; \
		exit 1; \
	fi
	@printf "[doctor] Hostname tip: use http://localhost:4000 or http://127.0.0.1:4000 in browser.\n"
	@printf "[doctor] 0.0.0.0 is a bind address and may fail as a browser URL on some systems.\n"
	@printf "✅ doctor passed.\n\n"

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
	@printf "[ui-test] Running CSS lint checks...\n"
	@npm run test:css || { printf "❌ CSS lint failed.\n"; exit 1; }
	@printf "[ui-test] Running Playwright UI tests in Docker...\n"
	@/bin/bash -lc 'set -o pipefail; docker compose --profile test run --rm -e UI_BASE_URL=http://jekyll:4000 playwright npx playwright test --config _docker/playwright/playwright.config.ts 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
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
					docker compose --profile test run --rm -p 9323:9323 playwright npx playwright show-report playwright-report --host 0.0.0.0 --port 9323; \
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
	@/bin/bash -lc 'set -o pipefail; docker compose --profile test run --rm -e UI_BASE_URL=http://jekyll:4000 -e WCAG_STRICT=0 playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/wcag.spec.ts 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
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
	@/bin/bash -lc 'set -o pipefail; docker compose --profile test run --rm -e UI_BASE_URL=http://jekyll:4000 -e WCAG_STRICT=1 playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/wcag.spec.ts 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
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

lighthouse-test:
	@printf "\n[lighthouse-test] Ensuring local site is running (docker compose up -d esbuild jekyll)...\n"
	@docker compose up -d esbuild jekyll >/dev/null
	@printf "[lighthouse-test] Waiting for http://localhost:4000 to become ready"
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
	@printf "[lighthouse-test] Running Lighthouse audits in Docker...\n"
	@/bin/bash -lc 'set -o pipefail; docker compose --profile test run --rm -e UI_BASE_URL=http://jekyll:4000 playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/lighthouse.spec.ts 2>&1 | sed "/^To open last HTML report run:/,+3d"; exit $${PIPESTATUS[0]}'; status=$$?; \
	printf "\n"; \
	if [ $$status -eq 0 ]; then \
		printf "✅ Lighthouse audits completed.\n"; \
	else \
		printf "❌ Lighthouse audits failed (exit %s).\n" "$$status"; \
	fi; \
	printf "Graphical report: assets/reports/lighthouse/latest.html\n"; \
	printf "Raw data: assets/reports/lighthouse/latest.json\n\n"; \
	exit $$status
