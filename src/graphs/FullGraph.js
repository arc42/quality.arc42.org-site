/**
 * FullGraph class
 * Specialized graph implementation for the full page graph with filtering
 */
import { Graph } from "./Graph";
import { MAX_FILTER_TERMS } from "./constants";
import { isProperty, isRootId, isStandard } from "./nodeUtils";

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
        // Track last-applied URL-selected standard to avoid redundant re-application
        this._lastAppliedStdId = null;
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
     * Re-apply URL-driven selected standard after each render/rebuild.
     * Ensures selection persists across filtering and other re-renders.
     * @private
     */
    _reapplySelectedStandardIfAny() {
        const state = this._readUrlState();
        const stdId = state.selectedStandard;
        if (stdId) {
            // Ensure standards are visible when enforcing a specific selection
            const stdToggleEl = document.getElementById('legend-toggle-standards');
            if (stdToggleEl && !stdToggleEl.checked) stdToggleEl.checked = true;
            if (this.renderer?.typeVisibility?.standard === false) {
                this.renderer.setTypeVisibility('standard', true);
                this._writeUrlState({ showStandards: true });
            }
            // Avoid redundant re-application if already applied and still active
            const needsApply = this._lastAppliedStdId !== stdId || !this.renderer?.selectionActive;
            if (needsApply) {
                const applyOnce = () => {
                    const applied = this._selectStandardById(stdId);
                    if (applied) {
                        this._lastAppliedStdId = stdId;
                    }
                    return applied;
                };

                // Apply as soon as render is ready
                this._waitForRenderThen(() => {
                    applyOnce();

                    // The graph often undergoes simulation stabilization and center-view transitions
                    // during the first ~2 seconds of load or filter. These can clear transient DOM classes.
                    // We perform multiple re-applications to ensure the selection "sticks".
                    const retryDelays = [300, 800, 1500, 2500];
                    retryDelays.forEach(delay => {
                        setTimeout(() => {
                            const stillSelectedInUrl = this._readUrlState().selectedStandard === stdId;
                            const selectionOk = this.renderer?.selectionActive === true &&
                                this.renderer?.selection?.id === stdId &&
                                this.renderer?.nodes?.filter(".highlighted").size() > 0;

                            if (stillSelectedInUrl && !selectionOk) {
                                applyOnce();
                            }
                        }, delay);
                    });
                });
            }
        } else {
            // Clear cache when no selection is present in URL
            this._lastAppliedStdId = null;
        }
    }

    /**
     * Override base render to re-apply URL-driven selection after rendering.
     * Keeps public API unchanged.
     */
    render() {
        const result = super.render();
        // After the renderer is (re)created and data bound, re-apply selection from URL if any
        this._reapplySelectedStandardIfAny();
        return result;
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
                // When standards are hidden, clear any active standard selection
                if (!e.target.checked) {
                    // Clear persistent selection state and any highlight flags
                    if (this.renderer?.selectionActive) {
                        this.renderer.setSelectionDimming(null, null, false);
                    }
                    if (this.renderer?.nodes) {
                        this.renderer.nodes.each(function (node) {
                            node.highlighted = false;
                            node.connectedHighlighted = false;
                        });
                    }
                    // Remove selected standard from URL state
                    this._writeUrlState({ selectedStandard: null });
                } else {
                    // Standards turned ON: if a selectedStandard exists in URL, re-apply it immediately
                    const state = this._readUrlState();
                    const stdId = state.selectedStandard;
                    if (stdId) {
                        this._waitForRenderThen(() => {
                            const applied = this._selectStandardById(stdId);
                            if (applied) {
                                this._lastAppliedStdId = stdId;
                            }
                        });
                    }
                }
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

        // Preview: only visually show if selection would be lost. 
        // We do not update URL state here as it is a preview.
        if (this.renderer?.selectionActive && this.renderer?.selection?.id) {
            const selId = this.renderer.selection.id;
            const filteredData = this.dataProvider.getFilteredData();
            const stillVisible = (filteredData.nodes || []).some(n => n.id === selId);
            if (!stillVisible) {
                // Clear highlight flags for preview (this.renderer.render will be called next)
                this.renderer.nodes.each(function (node) {
                    node.highlighted = false;
                    node.connectedHighlighted = false;
                });
            }
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

        // Validate selection: if a selected standard is now hidden by the text filter, remove it
        const urlStd = this._readUrlState()?.selectedStandard;
        if (urlStd) {
            const filteredData = this.dataProvider.getFilteredData();
            const stillVisible = (filteredData.nodes || []).some(n => n.id === urlStd);
            if (!stillVisible) {
                // Clear selection state
                if (this.renderer?.selectionActive) {
                    this.renderer.setSelectionDimming(null, null, false);
                }
                this.renderer.nodes.each(function (node) {
                    node.highlighted = false;
                    node.connectedHighlighted = false;
                });
                this._writeUrlState({ selectedStandard: null });
                this._lastAppliedStdId = null;
            }
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
            btn.setAttribute('aria-label', `Remove ${ term }`);
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
            this._applyStandardSelectionInternal(d.id, true);
        };

        return this.registerEventHandlers({
            nodeHover,
            nodeDoubleClick,
            nodeClick
        });
    }

    // ---------------- Selection helpers (centralized) ----------------
    /**
     * Normalize an endpoint to id.
     * @private
     */
    _endpointId(x) {
        return (x && typeof x === 'object') ? x.id : x;
    }

    /**
     * Resolve endpoint type robustly using node map if needed.
     * @private
     */
    _endpointType(x, nodeById) {
        if (x && typeof x === 'object') return x.qualityType;
        const nid = this._endpointId(x);
        const n = nodeById.get(nid);
        return n ? n.qualityType : undefined;
    }

    /**
     * Build a fast lookup map of current nodes by id.
     * @private
     */
    _buildNodeByIdMap() {
        const map = new Map();
        if (this.renderer?.nodes) {
            this.renderer.nodes.each(function (n) {
                map.set(n.id, n);
            });
        }
        return map;
    }

    /**
     * Compute connected node ids for a given standard id (qualities, properties, requirements, related qualities).
     * Robust to varying link endpoint shapes.
     * @param {string} stdId
     * @returns {Set<string>} connected node ids
     * @private
     */
    _collectConnectedForStandard(stdId) {
        const connectedQuals = new Set();
        const props = new Set();
        const reqs = new Set();

        if (!this.renderer?.links) return new Set();

        const nodeById = this._buildNodeByIdMap();
        const endpointType = (x) => this._endpointType(x, nodeById);
        const getId = (x) => this._endpointId(x);

        // First pass: collect direct neighbor qualities
        this.renderer.links.each(function (link) {
            const sId = getId(link.source);
            const tId = getId(link.target);
            const sType = endpointType(link.source);
            const tType = endpointType(link.target);
            if (sId === stdId && tType === 'quality') connectedQuals.add(tId);
            if (tId === stdId && sType === 'quality') connectedQuals.add(sId);
        });

        const qualLookup = new Set(connectedQuals);
        // Second pass: find properties and requirements attached to those qualities
        this.renderer.links.each(function (link) {
            const sId = getId(link.source);
            const tId = getId(link.target);
            const sType = endpointType(link.source);
            const tType = endpointType(link.target);
            if (qualLookup.has(sId) && tType === 'property') props.add(tId);
            if (qualLookup.has(tId) && sType === 'property') props.add(sId);
            if (qualLookup.has(sId) && tType === 'requirement') reqs.add(tId);
            if (qualLookup.has(tId) && sType === 'requirement') reqs.add(sId);
        });

        // Intentionally exclude "related qualities" from the selection-connected set.
        // Keeping only direct qualities and their properties/requirements makes dimming
        // visually meaningful (otherwise too much stays undimmed and dimming appears ineffective).
        return new Set([...connectedQuals, ...props, ...reqs]);
    }

    /**
     * Apply standard selection and dim unrelated nodes using centralized logic.
     * Optionally toggles off if the same selection is active.
     * @param {string} stdId
     * @param {boolean} toggleIfSame
     * @returns {boolean} true if selection applied, false if cleared or failed
     * @private
     */
    _applyStandardSelectionInternal(stdId, toggleIfSame = false) {
        if (!this.renderer?.nodes) return false;

        // Ensure the standard id exists in current data
        let found = false;
        this.renderer.nodes.each(function (n) {
            if (n.qualityType === 'standard' && n.id === stdId) found = true;
        });
        if (!found) {
            // Invalid id: clear URL param if coming from URL flow
            this._writeUrlState({ selectedStandard: null });
            return false;
        }

        const isSame = this.renderer.selectionActive && this.renderer.selection && this.renderer.selection.id === stdId;

        // Clear transient highlight flags
        this.renderer.nodes.each(function (node) {
            node.highlighted = false;
            node.connectedHighlighted = false;
        });

        if (isSame && toggleIfSame) {
            // Deselect
            this.renderer.selectionActive = false;
            this.renderer.setSelectionDimming(null, null, false);
            this.renderer.highlightNode(stdId, false, null);
            this._writeUrlState({ selectedStandard: null });
            return false;
        }

        // Compute connected sets and apply
        const connectedNodes = this._collectConnectedForStandard(stdId);
        // Mark connected flags for label visibility logic
        const nodeById = this._buildNodeByIdMap();
        connectedNodes.forEach(id => {
            const n = nodeById.get(id);
            if (n) n.connectedHighlighted = true;
        });

        const stdNode = nodeById.get(stdId);
        if (stdNode) stdNode.highlighted = true;

        this.renderer.selectionActive = true;
        this.renderer.highlightNode(stdId, true, connectedNodes);
        this.renderer.setSelectionDimming(stdId, connectedNodes, true);

        // Force an immediate redraw and visibility update to ensure changes are visible
        this.renderer.drawCanvas();
        if (this.renderer.updateNodeVisibility) this.renderer.updateNodeVisibility(this.renderer.currentZoomScale);
        if (this.renderer.updateLabelVisibility) this.renderer.updateLabelVisibility(this.renderer.currentZoomScale);

        this._writeUrlState({ selectedStandard: stdId });
        return true;
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
            // Ensure standards are visible when a specific standard is selected via URL
            const stdToggleEl = document.getElementById('legend-toggle-standards');
            if (stdToggleEl && !stdToggleEl.checked) {
                stdToggleEl.checked = true;
            }
            if (this.renderer?.typeVisibility?.standard === false) {
                this.renderer.setTypeVisibility('standard', true);
                // Reflect enforced visibility in URL state to avoid confusion when navigating
                this._writeUrlState({ showStandards: true });
            }
            this._waitForRenderThen(() => {
                const applied = this._selectStandardById(state.selectedStandard);
                if (applied) {
                    this._lastAppliedStdId = state.selectedStandard;
                }
            });
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
        // Delegate to centralized helper; do not toggle off when coming from URL
        return this._applyStandardSelectionInternal(stdId, false);
    }
}
