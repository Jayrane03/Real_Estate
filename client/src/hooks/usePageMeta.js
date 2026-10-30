import { useEffect } from "react";

export function usePageMeta(title, description, brandName = "Aurelia Residences", exactTitle = false) {
  useEffect(() => {
    document.title = exactTitle
      ? title || brandName
      : title
        ? `${title} | ${brandName}`
        : `${brandName} | Worli Sea Face`;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content =
      description ||
      "A considered collection of private residences on the Worli Sea Face.";
  }, [title, description]);
}
