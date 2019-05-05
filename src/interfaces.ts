export interface TOCOptions {
	/**
	 * The container where the content lives, to be used to generate the table of contents
	 */
	contentContainer: HTMLElement;
	/**
	 * The container inside of which the generated TOC will be mounted
	 */
	mountTo: HTMLElement;
	/**
	 * Whether corresponding TOC items should highlight as user scrolls
	 */
	highlightOnScroll: boolean;
}

export interface Heading {
	id: string;
	title: string;
}
