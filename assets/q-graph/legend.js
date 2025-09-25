class Legend {
    constructor(colorScale, zoomFunction, fullscreenFunction, toggleNodeVisibilityFunction, simulation, datasetChangeFunction, nodeTypes, searchFunction) {
        this.colorScale = colorScale;
        this.zoomFunction = zoomFunction;
        this.fullscreenFunction = fullscreenFunction;
        this.toggleNodeVisibilityFunction = toggleNodeVisibilityFunction;
        this.simulation = simulation;
        this.datasetChangeFunction = datasetChangeFunction;
        this.nodeTypes = nodeTypes;
        this.legendItems = {};
        this.searchFunction = searchFunction;
    }

    create() {
        // Remove any existing legend
        d3.select("#legend").remove();

        // Create new legend container
        const legend = d3.select("body")
            .append("div")
            .attr("id", "legend");

        this.createSearchControl(legend);
        legend.append("hr")
        this.createNodeTypes(legend);
        legend.append("hr");
        this.createZoomControl(legend);
        legend.append("hr");
        this.createCollapsibleForceControls(legend);
        legend.append("hr");
        this.createCollapsibleDataControls(legend);
        legend.append("hr");
        this.createFullscreenButton(legend);
    }

    createNodeTypes(legend) {
        const nodeTypesContainer = legend.append("div")
            .attr("class", "node-types-container");

        // Filter legend items based on node types present in the dataset
        const legendItemsData = [
            { type: "central", label: "Central Node" },
            { type: "property", label: "Properties" },
            { type: "quality", label: "Qualities" },
            { type: "example", label: "Examples" }
        ].filter(item => this.nodeTypes.includes(item.type));

        legendItemsData.forEach(item => {
            if (item.type !== "central") {
                const legendItem = nodeTypesContainer.append("div")
                    .attr("class", "legend-item");

                legendItem.append("div")
                    .attr("class", "legend-color")
                    .style("background-color", this.colorScale(item.type));

                legendItem.append("span")
                    .text(item.label);

                const toggleSwitch = legendItem.append("label")
                    .attr("class", "switch");

                toggleSwitch.append("input")
                    .attr("type", "checkbox")
                    .attr("checked", true)
                    .on("change", () => this.toggleNodeVisibilityFunction(item.type));

                toggleSwitch.append("span")
                    .attr("class", "slider round");

                this.legendItems[item.type] = legendItem;
            }
        });
    }

    createZoomControl(legend) {
        const zoomControl = legend.append("div")
            .attr("class", "zoom-control");

        zoomControl.append("div")
            .attr("class", "slider-label")
            .text("Zoom");

        zoomControl.append("input")
            .attr("type", "range")
            .attr("class", "zoom-slider")
            .attr("min", "0.1")
            .attr("max", "4")
            .attr("step", "0.1")
            .attr("value", "1")
            .on("input", (event) => {
                const scale = event.target.value;
                this.zoomFunction(parseFloat(scale));
            });
    }

    createCollapsibleForceControls(legend) {
        const layoutSection = legend.append("div")
            .attr("class", "collapsible-section");

        const layoutHeader = layoutSection.append("div")
            .attr("class", "collapsible-header")
            .text("Layout")
            .on("click", () => this.toggleCollapsible(layoutSection));

        layoutHeader.append("span")
            .attr("class", "collapsible-icon")
            .html("&#9660;"); // Down arrow

        const layoutContent = layoutSection.append("div")
            .attr("class", "collapsible-content");

        this.createSlider(layoutContent, "Link Distance", 30, 300, 100, value => {
            this.simulation.force("link").distance(value);
            this.simulation.alpha(1).restart();
        });

        this.createSlider(layoutContent, "Node Distance", 50, 300, 100, value => {
            this.simulation.force("link").distance(value);
            this.simulation.alpha(1).restart();
        });

        this.createSlider(layoutContent, "Charge Strength", -1000, 100, -30, value => {
            this.simulation.force("charge").strength(value);
            this.simulation.alpha(1).restart();
        });

        this.createSlider(layoutContent, "Node Strength", 0, 10, 1, value => {
            this.simulation.force("charge").strength(d => -30 * value);
            this.simulation.alpha(1).restart();
        });

    }

    createSearchControl(legend) {
        const searchSection = legend.append("div")
            .attr("class", "search-section");

        searchSection.append("label")
            .attr("for", "search-input")
            .text("Filter Nodes:");

        const searchInput = searchSection.append("input")
            .attr("id", "search-input")
            .attr("type", "text")
            .attr("placeholder", "Enter search term...");

        searchInput.on("input", () => {
            const searchTerm = searchInput.property("value");
            this.searchFunction(searchTerm);
        });
    }
    createCollapsibleDataControls(legend) {
        const dataSection = legend.append("div")
            .attr("class", "collapsible-section");

        const dataHeader = dataSection.append("div")
            .attr("class", "collapsible-header")
            .text("Data")
            .on("click", () => this.toggleCollapsible(dataSection));

        dataHeader.append("span")
            .attr("class", "collapsible-icon")
            .html("&#9660;"); // Down arrow

        const dataContent = dataSection.append("div")
            .attr("class", "collapsible-content");

        const datasets = [
            { id: "tiny", label: "Tiny" },
            { id: "iso25010", label: "ISO 25010" },
            { id: "q42", label: "Q42" }
        ];

        datasets.forEach((dataset, index) => {
            const radioLabel = dataContent.append("label")
                .attr("class", "radio-label");

            radioLabel.append("input")
                .attr("type", "radio")
                .attr("name", "dataset")
                .attr("value", dataset.id)
                .attr("checked", index === 0 ? true : null)
                .on("change", () => this.datasetChangeFunction(dataset.id));

            radioLabel.append("span")
                .text(dataset.label);
        });
    }

    createSlider(container, label, min, max, value, onInput) {
        const sliderControl = container.append("div")
            .attr("class", "slider-control");

        sliderControl.append("div")
            .attr("class", "slider-label")
            .text(label);

        sliderControl.append("input")
            .attr("type", "range")
            .attr("class", "force-slider")
            .attr("min", min)
            .attr("max", max)
            .attr("value", value)
            .on("input", function() {
                onInput(this.value);
            });
    }

    createFullscreenButton(legend) {
        const fullscreenLabel = legend.append("div")
            .attr("id", "fullscreen-label")
            .on("click", this.fullscreenFunction);

        fullscreenLabel.append("span")
            .attr("class", "fullscreen-text")
            .text("Fullscreen");

        fullscreenLabel.append("span")
            .attr("class", "fullscreen-icon")
            .html("⛶");
    }

    updateLegendItemStyle(nodeType, isVisible) {
        if (this.legendItems[nodeType]) {
            this.legendItems[nodeType].select("input").property("checked", isVisible);
        }
    }

    toggleCollapsible(section) {
        const content = section.select(".collapsible-content");
        const icon = section.select(".collapsible-icon");

        if (content.style("display") === "none") {
            content.style("display", "block");
            icon.html("&#9650;"); // Up arrow
        } else {
            content.style("display", "none");
            icon.html("&#9660;"); // Down arrow
        }
    }
}