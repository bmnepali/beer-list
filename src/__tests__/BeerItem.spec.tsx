/* eslint-env jest */

import { render, screen, within } from "@testing-library/react";
import BeerItem from "../compponents/BeerItem";
import { IMyBeer } from "../interfaces/Beer.interface";
import { generateUUID } from "../utils";

jest.mock("react-text-truncate", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

jest.mock("react-bootstrap", () => ({
  OverlayTrigger: ({ overlay, children }: { overlay: React.ReactNode; children: React.ReactNode }) => (
    <div>
      <span data-testid="overlay">{overlay}</span>
      {children}
    </div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => <div role="tooltip">{children}</div>,
}));

describe("BeerItem", () => {
  const beer: IMyBeer = {
    id: generateUUID(),
    name: "Beer Name",
    genere: "Beer Tagline",
    description: "Beer Description",
    ingredients: {
      malt: ["Malt 1", "Malt 2"],
      hops: ["Hop 1", "Hop 2"],
      yeast: "Yeast"
    },
    image_url: "/assets/houzz-beer.png"
  };

  it("should render the beer name", () => {
    render(<BeerItem beer={beer} />);
    const beerName = screen.getByText("Beer Name");
    expect(beerName).toBeDefined();
  });

  it("should render the beer tagline", () => {
    render(<BeerItem beer={beer} />);
    const beerTagline = screen.getByText("Beer Tagline");
    expect(beerTagline).toBeDefined();
  });

  it("should render the truncated beer description", () => {
    render(<BeerItem beer={beer} />);
    const beerDescription = screen.getByText("Beer Description");
    expect(beerDescription).toBeDefined();
  });

  it("should render the beer image with tooltip", () => {
    render(<BeerItem beer={beer} />);
    const beerImage = screen.getByAltText("Beer Name");
    expect(beerImage).toBeDefined();

    const tooltip = screen.getByRole("tooltip");

    const { getByText } = within(tooltip)
    expect(getByText("Ingredients: malt, hops, yeast")).toBeDefined();
  });

  it("should render the default beer image if image_url is not provided", () => {
    const beerWithoutImage = { ...beer, image_url: '' };
    render(<BeerItem beer={beerWithoutImage} />);
    const defaultImage = screen.getByTestId("beer-image");
    expect(defaultImage).toHaveProperty("src", "http://localhost/assets/houzz-beer.png");
  });
});