/**
 * FullGraph class
 * Specialized graph implementation for the full page graph with filtering
 */
import { Graph } from "./Graph";
import { MAX_FILTER_TERMS, QUALITY_ROOT_ID } from "./constants";
import { isRootId, isStandard, isProperty, isQuality } from "./nodeUtils";

// Standards dropdown removed in favor of a sidebar toggle

export class FullGraph extends Graph {

    #filterTypeState = {
        quality: true,
        requirement: false
    };

    // URL state cache
    _urlState = null;

    /**
     * @param {string} containerId - ID of the container element
     * @param {GraphDataProvider} dataProvider - Data provider instance
     */
    constructor(containerId, dataProvider) {
        super(containerId, "fullpage", dataProvider);
        this.filterInput = document.getElementById("full-q-graph-filter__input");
        this.filterButton = document.getElementById("full-q-graph-filter__btn");
        this.debounceTimeout = null;
        // Persisted UI state
        this.currentFilterTerm = ""; // raw input string (for URL/input)
        this.currentFilterTerms = []; // parsed terms (array, max 5) — kept for backward compatibility
        this.finalizedTerms = []; // chips terms (array, max 5)
        this.filterChipsContainer = null; // container element for chips
    }

    /**
     * Initialize the graph and register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    initialize() {
        super.initialize();
        this.registerFilterControls();
        this.registerLegendToggles();
        // Apply initial state from URL and listen to history changes
        this._applyStateFromUrl(true);
        globalThis.addEventListener('popstate', () => this._applyStateFromUrl(false));
        return this;
    }

    /**
     * Register legend toggles for qualities, requirements, and standards
     */
    registerLegendToggles() {
        const qualToggle = document.getElementById("legend-toggle-qualities");
        const reqToggle = document.getElementById("legend-toggle-requirements");
        const stdToggle = document.getElementById("legend-toggle-standards");

        // Guard if legend not present
        if (!qualToggle || !reqToggle) {
            return this;
        }

        // Sync current renderer state to inputs
        qualToggle.checked = this.renderer.typeVisibility.quality;
        reqToggle.checked = this.renderer.typeVisibility.requirement;
        if (stdToggle) stdToggle.checked = this.renderer.typeVisibility.standard;

        // Listen for changes
        qualToggle.addEventListener("change", (e) => {
            this.#filterTypeState.quality = e.target.checked;
            // Drive visibility via renderer to avoid resetting text filter
            this.renderer.setTypeVisibility('quality', e.target.checked);
            this._writeUrlState({ showQualities: e.target.checked });
        });
        reqToggle.addEventListener("change", (e) => {
            this.#filterTypeState.requirement = e.target.checked;
            // Drive visibility via renderer to avoid resetting text filter
            this.renderer.setTypeVisibility('requirement', e.target.checked);
            this._writeUrlState({ showRequirements: e.target.checked });
        });
        if (stdToggle) {
            stdToggle.addEventListener("change", (e) => {
                this.renderer.setTypeVisibility('standard', e.target.checked);
                this._writeUrlState({ showStandards: e.target.checked });
            });
        }

        return this;
    }

    /**
     * Register filter controls
     * @returns {FullGraph} This graph instance for chaining
     */
    registerFilterControls() {
        if (!this.filterInput) {
            console.error("Filter input element not found");
            return this;
        }

        if (!this.filterButton) {
            console.error("Filter button element not found");
            return this;
        }

        // Ensure chips container exists just below the input
        this._ensureChipsContainer();

        // Apply filter immediately when button is clicked
        this.filterButton.addEventListener("click", () => {
            // Finalize any pending input (treat whole input as terms, comma-separated)
            this._finalizeInputIntoChips(this.filterInput.value, true);
            this.filterInput.value = "";
            this.filter("");
        });

        // Handle typing: when a comma appears, finalize preceding token(s) into chips
        this.filterInput.addEventListener("input", (e) => {
            this._handleTypingForChips(e.target);
            // Also perform debounced live filtering using pending input (without creating chips)
            this.debounceFilter(e.target.value);
        });

        // Also handle Enter key for immediate filtering
        this.filterInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
                // Finalize pending token on Enter
                const val = this.filterInput.value.trim();
                if (val) {
                    this._finalizeInputIntoChips(val, false);
                    this.filterInput.value = "";
                }
                this.filter("");
            }
        });

        return this;
    }

    /**
     * Debounce live preview filtering with 300ms delay.
     * While typing, apply filtering using finalized chip terms plus the pending input
     * without changing chips or URL. Chips are only created on comma/Enter.
     * @param {string} value - Current input value (pending token)
     */
    debounceFilter(value) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this._applyFiltersPreview(value);
        }, 300);
    }

    /**
     * Apply filters for live preview combining finalized terms and an optional pending term.
     * Does NOT update URL or chips; purely affects current rendered filter state.
     * @param {string} pendingValue
     */
    _applyFiltersPreview(pendingValue) {
        // If input is disabled due to reaching the cap, ignore pending text
        const inputDisabled = !!this.filterInput && this.filterInput.disabled;
        const pending = inputDisabled ? "" : String(pendingValue || "").trim();

        // Compose terms: finalized chips + one pending token (if any)
        const terms = [];
        const seen = new Set();
        for (const t of (this.finalizedTerms || [])) {
            const k = this._termKey(t);
            if (!seen.has(k)) {
                seen.add(k);
                terms.push(t);
            }
        }
        if (pending) {
            const pk = this._termKey(pending);
            if (!seen.has(pk) && terms.length < MAX_FILTER_TERMS) {
                terms.push(pending);
            }
        }

        const termActive = terms.length > 0;
        const qualitiesHidden = this.renderer?.typeVisibility?.quality === false;
        const requirementsVisible = this.renderer?.typeVisibility?.requirement !== false;

        if (termActive) {
            this.dataProvider.filterByTerm(terms, { qualitiesHidden, requirementsVisible });
        } else {
            this.dataProvider.resetFilter();
        }
        if (this.renderer) this.renderer.isFiltering = termActive;
        this.renderFiltered();
    }

    /**
     * Register default event handlers for the full graph
     * @returns {Graph} This graph instance for chaining
     */
    // Override filter to be aware of legend toggles and support multiple terms
    filter(filterTerm) {
        // In the new UX, filtering is driven by finalized chip terms only.
        // Maintain currentFilterTerms for downstream compatibility.
        this.currentFilterTerm = this.finalizedTerms.join(", ");
        this.currentFilterTerms = [...this.finalizedTerms];
        this.applyFiltersCombined();
        this._writeUrlState({ filter: this.currentFilterTerm });
        this._renderFilterChips();
        return this;
    }

    /**
     * Apply both standard and term filters together as needed
     */
    applyFiltersCombined() {
        // Always use finalized (chip) terms for filtering
        const terms = Array.isArray(this.finalizedTerms) ? this.finalizedTerms : [];
        const termActive = terms.length > 0;

        const qualitiesHidden = this.renderer?.typeVisibility?.quality === false;
        const requirementsVisible = this.renderer?.typeVisibility?.requirement !== false;

        if (termActive) {
            this.dataProvider.filterByTerm(terms, { qualitiesHidden, requirementsVisible });
        } else {
            this.dataProvider.resetFilter();
        }

        if (this.renderer) this.renderer.isFiltering = termActive;
        this.renderFiltered();
        // Update chips after render/filter state change
        this._renderFilterChips();
        return this;
    }

    // ---------------- Helpers ----------------
    _parseTerms(value) {
        const v = (value || "").trim();
        if (v === "") return [];
        // Split by commas or whitespace, collapse multiples, dedupe, limit to 5
        const parts = v
            .split(/[\s,]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
        const seen = new Set();
        const out = [];
        for (const p of parts) {
            const key = p.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                out.push(p);
                if (out.length >= MAX_FILTER_TERMS) break;
            }
        }
        return out;
    }

    _normalizeTerm(t) {
        const s = String(t || "").trim();
        return s;
    }

    _termKey(t) {
        return String(t).toLowerCase();
    }

    _addFinalizedTerms(tokens) {
        if (!Array.isArray(tokens)) tokens = [tokens];
        for (let raw of tokens) {
            const term = this._normalizeTerm(raw);
            if (!term) continue;
            const key = this._termKey(term);
            const existingKeys = new Set(this.finalizedTerms.map(x => this._termKey(x)));
            if (existingKeys.has(key)) continue;
            if (this.finalizedTerms.length >= MAX_FILTER_TERMS) break;
            this.finalizedTerms.push(term);
        }
        // Keep compatibility arrays in sync
        this.currentFilterTerms = [...this.finalizedTerms];
        this.currentFilterTerm = this.finalizedTerms.join(", ");
    }

    _removeFinalizedTerm(term) {
        const key = this._termKey(term);
        this.finalizedTerms = this.finalizedTerms.filter(t => this._termKey(t) !== key);
        this.currentFilterTerms = [...this.finalizedTerms];
        this.currentFilterTerm = this.finalizedTerms.join(", ");
    }

    _finalizeInputIntoChips(inputValue, allowMultiple) {
        const val = String(inputValue || "");
        if (!val) return;
        if (allowMultiple) {
            // Split by commas; only commas finalize chips in this UX
            let parts = val.split(",").map(s => s.trim()).filter(Boolean);
            const remaining = Math.max(0, MAX_FILTER_TERMS - this.finalizedTerms.length);
            if (remaining <= 0) {
                // Already at cap, just clear input
                if (this.filterInput) this.filterInput.value = "";
            } else if (parts.length) {
                if (parts.length > remaining) parts = parts.slice(0, remaining);
                this._addFinalizedTerms(parts);
            }
        } else {
            const term = val.trim();
            if (term) this._addFinalizedTerms([term]);
        }
        // After adding, apply filter and update URL/chips
        this.applyFiltersCombined();
        this._writeUrlState({ filter: this.currentFilterTerm });
        this._renderFilterChips();
    }

    _handleTypingForChips(inputEl) {
        // When a comma is typed, finalize the segment(s) before the last comma
        const value = inputEl.value;
        const lastComma = value.lastIndexOf(",");
        if (lastComma !== -1) {
            const before = value.slice(0, lastComma);
            const after = value.slice(lastComma + 1);
            let tokens = before.split(",").map(s => s.trim()).filter(Boolean);
            if (tokens.length > 0) {
                const remaining = Math.max(0, MAX_FILTER_TERMS - this.finalizedTerms.length);
                if (remaining > 0) {
                    if (tokens.length > remaining) tokens = tokens.slice(0, remaining);
                    this._addFinalizedTerms(tokens);
                }
                // Clear the finalized part, keep pending remainder in input
                inputEl.value = remaining > 0 ? after.trimStart() : "";
                this.applyFiltersCombined();
                this._writeUrlState({ filter: this.currentFilterTerm });
                this._renderFilterChips();
            }
        }
    }

    // Ensure the chips container exists below the filter input
    _ensureChipsContainer() {
        if (this.filterChipsContainer && document.body.contains(this.filterChipsContainer)) return;
        if (!this.filterInput) return;
        let container = document.getElementById('full-q-graph-filter__chips');
        if (!container) {
            container = document.createElement('div');
            container.id = 'full-q-graph-filter__chips';
            // Insert right after the input element
            if (this.filterInput.nextSibling) {
                this.filterInput.parentNode.insertBefore(container, this.filterInput.nextSibling);
            } else {
                this.filterInput.parentNode.appendChild(container);
            }
        }
        this.filterChipsContainer = container;
    }

    // Render the current filter terms as chips below the input
    _renderFilterChips() {
        this._ensureChipsContainer();
        const container = this.filterChipsContainer;
        if (!container) return;
        // Clear previous
        container.innerHTML = '';
        const terms = Array.isArray(this.finalizedTerms) ? this.finalizedTerms : [];
        if (!terms.length) {
            container.style.display = 'none';
            if (this.filterInput) this.filterInput.disabled = false;
            return;
        }
        container.style.display = '';
        terms.forEach(term => {
            const chip = document.createElement('span');
            chip.className = 'q-chip';

            const label = document.createElement('span');
            label.className = 'q-chip__label';
            label.textContent = term;

            const btn = document.createElement('button');
            btn.className = 'q-chip__close';
            btn.type = 'button';
            btn.setAttribute('aria-label', `Remove ${term}`);
            btn.innerHTML = '&times;';
            btn.addEventListener('click', () => {
                this._removeFinalizedTerm(term);
                this.applyFiltersCombined();
                this._writeUrlState({ filter: this.currentFilterTerm });
                this._renderFilterChips();
            });

            chip.appendChild(label);
            chip.appendChild(btn);
            container.appendChild(chip);
        });

        // Disable input if at cap; re-enable otherwise
        if (this.filterInput) {
            const atCap = terms.length >= MAX_FILTER_TERMS;
            this.filterInput.disabled = atCap;
            if (atCap) this.filterInput.value = '';
        }
    }

    registerDefaultEventHandlers() {
        // Default double-click handler for navigation
        const nodeDoubleClick = (event, d) => {
            if (!isRootId(d.id)) {
                globalThis.location.href = this.graph.getNodeAttribute(d.id, "page");
            }
        };

        // Default hover handler for highlighting (non-persistent)
        const nodeHover = (event, d) => {
            if (this.renderer.selectionActive) return; // Don't interfere with active selection
            // Toggle highlight state
            const isHighlighted = d.highlighted;

            // Clear all highlights first
            this.renderer.nodes.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            let connectedNodes = new Set();
            if (!isHighlighted) {
                // Highlight this node and its connections
                d.highlighted = true;

                if (isStandard(d)) {
                    // Direct neighbors (qualities)
                    const qualities = new Set();
                    const props = new Set();
                    // First collect direct neighbors
                    this.renderer.links.each(function (link) {
                        if (link.source.id === d.id) {
                            qualities.add(link.target.id);
                            link.target.connectedHighlighted = true;
                        }
                        if (link.target.id === d.id) {
                            qualities.add(link.source.id);
                            link.source.connectedHighlighted = true;
                        }
                    });
                    // Then collect properties 2-hop via qualities
                    const qualLookup = new Set(qualities);
                    this.renderer.links.each(function (link) {
                        if (qualLookup.has(link.source.id) && isProperty(link.target)) {
                            props.add(link.target.id);
                            link.target.connectedHighlighted = true;
                        }
                        if (qualLookup.has(link.target.id) && isProperty(link.source)) {
                            props.add(link.source.id);
                            link.source.connectedHighlighted = true;
                        }
                    });
                    connectedNodes = new Set([...qualities, ...props]);
                } else {
                    // Default: 1-hop neighbors
                    this.renderer.links.each(function (link) {
                        if (link.source.id === d.id) {
                            connectedNodes.add(link.target.id);
                            link.target.connectedHighlighted = true;
                        }
                        if (link.target.id === d.id) {
                            connectedNodes.add(link.source.id);
                            link.source.connectedHighlighted = true;
                        }
                    });
                }
            }

            // Update visual appearance
            this.renderer.highlightNode(d.id, !isHighlighted, connectedNodes);
        };

        // Click handler: persistent selection for standards (dims unrelated)
        const nodeClick = (event, d) => {
            if (!isStandard(d)) return;

            const isSameSelection = this.renderer.selectionActive && this.renderer.selection && this.renderer.selection.id === d.id;

            // Clear all highlights first
            this.renderer.nodes.each(function (node) {
                node.highlighted = false;
                node.connectedHighlighted = false;
            });

            if (isSameSelection) {
                // Deselect
                this.renderer.selectionActive = false;
                this.renderer.setSelectionDimming(null, null, false);
                this.renderer.highlightNode(d.id, false, null);
                this._writeUrlState({ selectedStandard: null });
                return;
            }

            // Compute related nodes: direct qualities, properties via those qualities, requirements attached to those qualities,
            // and qualities connected to those qualities (quality↔quality)
            const qualities = new Set();
            const props = new Set();
            const reqs = new Set();
            const relatedQuals = new Set();
            // First pass: collect direct neighbors (qualities)
            this.renderer.links.each(function (link) {
                if (link.source.id === d.id) {
                    if (isQuality(link.target)) {
                        qualities.add(link.target.id);
                    }
                    link.target.connectedHighlighted = true;
                }
                if (link.target.id === d.id) {
                    if (isQuality(link.source)) {
                        qualities.add(link.source.id);
                    }
                    link.source.connectedHighlighted = true;
                }
            });
            // Build lookup for selected qualities
            const qualLookup = new Set(qualities);
            // Second pass: collect properties (2-hop), requirements, and related qualities attached to those qualities
            this.renderer.links.each(function (link) {
                const sId = link.source.id;
                const tId = link.target.id;
                const sType = link.source.qualityType;
                const tType = link.target.qualityType;

                // Properties connected to selected qualities
                if (qualLookup.has(sId) && tType === 'property') {
                    props.add(tId);
                    link.target.connectedHighlighted = true;
                }
                if (qualLookup.has(tId) && sType === 'property') {
                    props.add(sId);
                    link.source.connectedHighlighted = true;
                }

                // Requirements connected to selected qualities (indirect relation to the standard)
                if (qualLookup.has(sId) && tType === 'requirement') {
                    reqs.add(tId);
                    link.target.connectedHighlighted = true;
                }
                if (qualLookup.has(tId) && sType === 'requirement') {
                    reqs.add(sId);
                    link.source.connectedHighlighted = true;
                }

                // Qualities connected to the selected qualities (quality↔quality edges)
                if (qualLookup.has(sId) && tType === 'quality') {
                    relatedQuals.add(tId);
                    link.target.connectedHighlighted = true;
                }
                if (qualLookup.has(tId) && sType === 'quality') {
                    relatedQuals.add(sId);
                    link.source.connectedHighlighted = true;
                }
            });
            const connectedNodes = new Set([...qualities, ...props, ...reqs, ...relatedQuals]);

            // Mark selected and apply visuals
            d.highlighted = true;
            this.renderer.selectionActive = true;
            this.renderer.highlightNode(d.id, true, connectedNodes);
            this.renderer.setSelectionDimming(d.id, connectedNodes, true);
            this._writeUrlState({ selectedStandard: d.id });
        };

        return this.registerEventHandlers({
            nodeHover,
            nodeDoubleClick,
            nodeClick
        });
    }

    // ---------------- URL State Helpers ----------------
    _readUrlState() {
        const p = new URLSearchParams(globalThis.location.search);
        const toBool = (v) => v === '1' || v === 'true';
        const state = {
            filter: p.get('filter') || '',
            showQualities: p.has('showQualities') ? toBool(p.get('showQualities')) : undefined,
            showRequirements: p.has('showRequirements') ? toBool(p.get('showRequirements')) : undefined,
            showStandards: p.has('showStandards') ? toBool(p.get('showStandards')) : undefined,
            selectedStandard: p.get('selectedStandard') || null,
        };
        this._urlState = state;
        return state;
    }

    _writeUrlState(partial) {
        const p = new URLSearchParams(globalThis.location.search);
        const setOrDel = (key, val) => {
            if (val === undefined) return; // leave as-is
            if (val === null || val === '' || (typeof val === 'boolean' && val === this._defaultFor(key))) {
                p.delete(key);
            } else {
                p.set(key, typeof val === 'boolean' ? (val ? '1' : '0') : String(val));
            }
        };
        // merge with current known state
        const cur = this._readUrlState();
        const next = { ...cur, ...partial };
        setOrDel('filter', next.filter);
        setOrDel('showQualities', next.showQualities);
        setOrDel('showRequirements', next.showRequirements);
        setOrDel('showStandards', next.showStandards);
        setOrDel('selectedStandard', next.selectedStandard);
        const newUrl = `${ globalThis.location.pathname }?${ p.toString() }`;
        globalThis.history.replaceState({}, '', newUrl);
        this._urlState = next;
    }

    _defaultFor(key) {
        // default UI/renderer state
        switch (key) {
            case 'showQualities':
                return true;
            case 'showRequirements':
                return false;
            case 'showStandards':
                return true;
            default:
                return null;
        }
    }

    _applyStateFromUrl(initial = false) {
        const state = this._readUrlState();
        // Apply toggles if present
        const qualToggle = document.getElementById('legend-toggle-qualities');
        const reqToggle = document.getElementById('legend-toggle-requirements');
        const stdToggle = document.getElementById('legend-toggle-standards');
        if (state.showQualities !== undefined && qualToggle) {
            qualToggle.checked = !!state.showQualities;
            this.renderer.setTypeVisibility('quality', !!state.showQualities);
        }
        if (state.showRequirements !== undefined && reqToggle) {
            reqToggle.checked = !!state.showRequirements;
            this.renderer.setTypeVisibility('requirement', !!state.showRequirements);
        }
        if (state.showStandards !== undefined && stdToggle) {
            stdToggle.checked = !!state.showStandards;
            this.renderer.setTypeVisibility('standard', !!state.showStandards);
        }
        // Apply filter term if present
        if (typeof state.filter === 'string' && this.filterInput) {
            // Parse URL filter into finalized chips; leave input empty
            this.currentFilterTerm = state.filter;
            // Support both comma and whitespace separated for backward compatibility
            const parsed = this._parseTerms(this.currentFilterTerm);
            this.finalizedTerms = parsed.slice(0, MAX_FILTER_TERMS);
            this.currentFilterTerms = [...this.finalizedTerms];
            this.filterInput.value = '';
            this.applyFiltersCombined();
            this._renderFilterChips();
        }
        // Apply selection after render is available
        if (state.selectedStandard) {
            this._waitForRenderThen(() => this._selectStandardById(state.selectedStandard));
        } else if (!initial) {
            // If cleared, ensure no selection
            if (this.renderer?.selectionActive) {
                this.renderer.setSelectionDimming(null, null, false);
            }
        }
    }

    _waitForRenderThen(fn, tries = 0) {
        const ready = this.renderer?.links && this.renderer?.nodes && this.renderer?.labels;
        if (ready) {
            fn();
        } else if (tries < 100) {
            setTimeout(() => this._waitForRenderThen(fn, tries + 1), 50);
        }
    }

    _selectStandardById(stdId) {
        if (!this.renderer?.links) return;
        // Find standard node exists
        let found = false;
        this.renderer.nodes.each(function (n) {
            if (n.qualityType === 'standard' && n.id === stdId) found = true;
        });
        if (!found) return;

        // Compute same connected set as in click handler
        const d = { id: stdId, qualityType: 'standard' };
        const qualities = new Set();
        const props = new Set();
        const reqs = new Set();
        const relatedQuals = new Set();
        this.renderer.links.each(function (link) {
            if (link.source.id === d.id) {
                if (link.target.qualityType === 'quality') {
                    qualities.add(link.target.id);
                }
            }
            if (link.target.id === d.id) {
                if (link.source.qualityType === 'quality') {
                    qualities.add(link.source.id);
                }
            }
        });
        const qualLookup = new Set(qualities);
        this.renderer.links.each(function (link) {
            const sId = link.source.id;
            const tId = link.target.id;
            const sType = link.source.qualityType;
            const tType = link.target.qualityType;
            if (qualLookup.has(sId) && tType === 'property') props.add(tId);
            if (qualLookup.has(tId) && sType === 'property') props.add(sId);
            if (qualLookup.has(sId) && tType === 'requirement') reqs.add(tId);
            if (qualLookup.has(tId) && sType === 'requirement') reqs.add(sId);
            if (qualLookup.has(sId) && tType === 'quality') relatedQuals.add(tId);
            if (qualLookup.has(tId) && sType === 'quality') relatedQuals.add(sId);
        });
        const connectedNodes = new Set([...qualities, ...props, ...reqs, ...relatedQuals]);
        // Apply selection
        this.renderer.nodes.each(function (node) {
            node.highlighted = false;
            node.connectedHighlighted = false;
        });
        this.renderer.selectionActive = true;
        this.renderer.highlightNode(stdId, true, connectedNodes);
        this.renderer.setSelectionDimming(stdId, connectedNodes, true);
    }
}
