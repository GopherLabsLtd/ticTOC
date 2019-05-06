// Styles
import "./styles/styles.scss";

// Configs & interfaces
import * as Interfaces from "./interfaces";
import * as Configurations from "./configurations";

const getPageHeight = () => Math.max(document.body.scrollHeight, document.body.offsetHeight, document.body.clientHeight);

export class TicTOC {
	options: Interfaces.TOCOptions;
	headings: Array<Interfaces.Heading> = [];

	lastActiveItem: HTMLElement;

	constructor(options) {
		this.options = Object.assign({}, Configurations.DEFAULT_OPTIONS, options);

		this.generateTOC();
	}

	generateTOC() {
		// Process all headings into an object
		this.processHeadings();

		// Mount TOC
		this.mountTOC();
	}

	processHeadings() {
		const { HEADING_TYPES } = Configurations;
		const headingElements = this.getAllHeadingElements();

		// Keep track of parent items
		let lastParentItem;
		headingElements.forEach((headingElement, i) => {
			// If the DOM element has no ID, assign one to it
			let elementID = headingElement.id;
			if (!elementID) {
				elementID = `ticTOC_heading_${i}`;

				// Assign an ID to the heading element
				headingElement.id = elementID;
			}

			// TODO - Refactor for more scalability - once supporting more selectors for headings
			// Determine the kind of the heading
			const headingTagName = headingElement.tagName.toLowerCase();

			let headingType;
			if (i === 0 && headingTagName === "h1") {
				headingType = HEADING_TYPES.TITLE;
			} else {
				// TODO - Second condition would need to change if more varieties of selectors are supported
				if (lastParentItem && headingTagName > lastParentItem) {
					headingType = HEADING_TYPES.SUBTITEM;
				} else {
					headingType = HEADING_TYPES.ITEM;
					lastParentItem = headingTagName;
				}
			}

			// Save heading info
			this.headings.push({
				title: headingElement.innerText,
				id: elementID,
				type: headingType
			});
		});
	}

    /**
     * Retrieves DOM elements for all headings in the specified container
     * @returns array of all heading DOM elements
     */
	getAllHeadingElements(): Array<HTMLElement> {
		const { contentContainer } = this.options;
		const headingsNodeList = contentContainer.querySelectorAll(
			"h1, h2, h3, h4, h5, h6"
		);

		return Array.prototype.slice.call(headingsNodeList);
	}

	addScrollEventListeners() {
		const scrollHandler = e => {
			const pageScrollPosition = window.pageYOffset;

			// Get distances of all headings
			// From scroll position
			let elementToHighlight;
			// If the visible bottom of the page is further than or equal to page height
			if (pageScrollPosition + window.innerHeight >= getPageHeight()) {
				elementToHighlight = this.headings[this.headings.length - 1];
			} else if (pageScrollPosition === 0) { // If user hasn't scrolled yet
				elementToHighlight = this.headings[0];
			} else {
				let headingDistances = this.headings.map(heading => {
					const element = document.getElementById(heading.id);
					const distance = pageScrollPosition - element.offsetTop;

					return {
						id: heading.id,
						distance
					};
				});

				// Remove all negative values, and sort by distance
				headingDistances = headingDistances.filter(hD => hD.distance >= 0)
					.sort((a, b) => a.distance - b.distance);

				elementToHighlight = headingDistances[0];
			}

			if (elementToHighlight) {
				const liElement = document.querySelector(`li.ticTOC_li.${elementToHighlight.id}`);
				if (this.lastActiveItem !== liElement) {
					// Remove `active` class from last highlighted anchor
					if (this.lastActiveItem) {
						this.lastActiveItem.classList.remove("active");
					}

					liElement.classList.add("active");
					this.lastActiveItem = liElement as HTMLElement;
				}
			}
		};

		window.addEventListener("scroll", scrollHandler);

		scrollHandler(null);
	}

	mountTOC() {
		const { mountTo } = this.options;

		// Create toc holder
		const tocHolder = document.createElement("div");
		tocHolder.className = Configurations.MOUNTING.CLASSNAME;

		const ul = document.createElement("ul");
		// Create list items for every headings
		this.headings.forEach(heading => {
			// Create list item
			const li = document.createElement("li");
			li.className = `ticTOC_li ${heading.id} type_${heading.type}`;

			// Carete anchors
			const link = document.createElement("a");
			link.href = `#${heading.id}`;
			link.innerText = heading.title;
			link.className = `ticTOC_anchor ${heading.id}`;

			li.appendChild(link);
			ul.appendChild(li);
		});

		// Add <ul> to the TOC holder
		tocHolder.appendChild(ul);

		// Add TOC holder to specified holder
		mountTo.appendChild(tocHolder);

		// If items need to highlight on scroll
		// Attach scroll event listeners to the page
		if (this.options.highlightOnScroll) {
			this.addScrollEventListeners();
		}
	}
}
