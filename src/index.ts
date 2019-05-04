import "./styles/styles.scss";

export default class TicTOC {
    options;

    constructor(options) {
      console.log("YO", options);
  
      this.options = options;
  
      this.go();
    }
  
    go() {
      const { from: contentElement, to: toElement } = this.options;
  
      const headingElements = contentElement.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
  
      const headings = [];
      [].forEach.call(headingElements, (headingElement, i) => {
        let elementID = headingElement.id;
        if (!elementID) {
          elementID = `tocjs-heading-${i}`;
          // Assign an ID to the heading element
          headingElement.id = elementID;
        }

        console.log("headingElement", headingElement)
  
        // Save heading info
        headings.push({
          title: headingElement.innerText,
          id: elementID
        });
      });
  
      // Create toc holder
      const tocHolder = document.createElement("div");
      tocHolder.className = "ticTOC";

      // Create list items for every headings
      headings.forEach(heading => {
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.innerText = heading.title;
  
        tocHolder.appendChild(link);
      });

      // Add TOC holder to specified holder
      toElement.appendChild(tocHolder);
    }
  }
  