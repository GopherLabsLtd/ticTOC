// Styles
import "./styles/styles.scss";

// Configs & interfaces
import * as Interfaces from "./interfaces";
import * as Configurations from "./configurations";

const getPageHeight = () => Math.max(document.body.scrollHeight, document.body.offsetHeight, document.body.clientHeight);

export default class TicTOC {
	options: Interfaces.TOCOptions;
	headings: Array<Interfaces.Heading> = [];

	lastActiveAnchor: HTMLElement;

	constructor(options) {
		this.options = Object.assign({}, Configurations.DEFAULT_OPTIONS, options);

		this.generateTOC();
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

	generateTOC() {
		const headingElements = this.getAllHeadingElements();
		headingElements.forEach((headingElement, i) => {
			let elementID = headingElement.id;
			if (!elementID) {
				elementID = `ticTOC_heading_${i}`;
				// Assign an ID to the heading element
				headingElement.id = elementID;
			}

			// Save heading info
			this.headings.push({
				title: headingElement.innerText,
				id: elementID
			});
		});

		// Mount TOC
		this.mountTOC();
	}

	addScrollEventListeners() {
		const scrollHandler = e => {
			const pageScrollPosition = window.pageYOffset;
			// console.log("PAGE POS", pageScrollPosition)

			// Get distances of all headings
			// From scroll position
			let positiveDistanceExists = false;
			let elementToHighlight;
			if (pageScrollPosition + window.innerHeight >= getPageHeight()) {
				elementToHighlight = this.headings[this.headings.length - 1];
			} else if (pageScrollPosition === 0) {
				elementToHighlight = this.headings[0];
			} else {
				let headingDistances = this.headings.map(heading => {
					const element = document.getElementById(heading.id);
					const distance = pageScrollPosition - element.offsetTop;

					if (distance >= 0) {
						positiveDistanceExists = true;
					}

					return {
						id: heading.id,
						distance
					};
				});

				headingDistances = headingDistances.filter(hD => hD.distance >= 0)
					.sort((a, b) => a.distance - b.distance)
				// let distancesToFilter = headingDistances;
				// if (positiveDistanceExists) {
				// 	// Take out all negative values
				// 	distancesToFilter = headingDistances.filter(distance => distance >= 0)
				// }

				elementToHighlight = headingDistances[0];
			}

			if (elementToHighlight) {
				const liElement = document.querySelector(`li.ticTOC_li.${elementToHighlight.id}`);
				if (this.lastActiveAnchor !== liElement) {
					if (this.lastActiveAnchor) {
						this.lastActiveAnchor.classList.remove("active");
					}

					liElement.classList.add("active");
					this.lastActiveAnchor = liElement as HTMLElement;
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
		this.headings.forEach((heading, i) => {
			const headingElement = document.getElementById(heading.id);

			// Create list item
			const li = document.createElement("li");
			let liClassToUse = "";
			if (i === 0 && headingElement.tagName.toLowerCase() === "h1") {
				liClassToUse = "ticTOC_title";
			}
			li.className = [`ticTOC_li ${heading.id}`, liClassToUse].join(" ");

			// Carete anchors
			const link = document.createElement("a");
			link.href = `#${heading.id}`;
			link.innerText = heading.title;
			link.className = `ticTOC_anchor ${heading.id}`;

			li.appendChild(link);
			ul.appendChild(li);
		});

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
