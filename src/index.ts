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

		if (this.options.highlightOnScroll) {
			this.addScrollEventListeners();
		}

		// Mount TOC
		this.mountTOC();
	}

	addScrollEventListeners() {
		window.addEventListener("scroll", e => {
			const pageScrollPosition = window.pageYOffset;
			// console.log("PAGE POS", pageScrollPosition)

			// Get distances of all headings
			// From scroll position
			let positiveDistanceExists = false;
			let elementToHighlight;
			if (pageScrollPosition + window.innerHeight >= getPageHeight()) {
				elementToHighlight = this.headings[this.headings.length - 1];
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
				const anchorElement = document.querySelector(`a.ticTOC_anchor.${elementToHighlight.id}`);
				if (this.lastActiveAnchor !== anchorElement) {
					if (this.lastActiveAnchor) {
						this.lastActiveAnchor.classList.remove("active");
					}

					anchorElement.classList.add("active");
					this.lastActiveAnchor = anchorElement as HTMLElement;
				}
			}
		});
	}

	mountTOC() {
		const { mountTo } = this.options;

		// Create toc holder
		const tocHolder = document.createElement("div");
		tocHolder.className = Configurations.MOUNTING.CLASSNAME;

		// Create list items for every headings
		this.headings.forEach(heading => {
			const link = document.createElement("a");
			link.href = `#${heading.id}`;
			link.innerText = heading.title;
			link.className = `ticTOC_anchor ${heading.id}`;

			tocHolder.appendChild(link);
		});

		// Add TOC holder to specified holder
		mountTo.appendChild(tocHolder);
	}
}
