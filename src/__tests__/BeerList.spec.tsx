import { render, screen, fireEvent } from "@testing-library/react";
import { ReactNode } from "react";
import BeerList from "../compponents/BeerList";
import EmptyList from "../compponents/EmptyList";

jest.mock("react-text-truncate", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe("BeerList", () => {
  const beerList = [
    {
      id: 1,
      name: "Beer 1",
      tagline: "Tagline 1",
      description: "Description 1",
      ingredients: {},
      image_url: "/beer1.jpg"
    },
    {
      id: 2,
      name: "Beer 2",
      tagline: "Tagline 2",
      description: "Description 2",
      ingredients: {},
      image_url: "/beer2.jpg"
    }
  ];

  it("should render the list of beers", () => {
    render(<BeerList beerList={beerList} emptyMessage={() => <EmptyList />} loadMore={{
      isLoading: false,
      onLoadMore: jest.fn(),
      show: true
    }}/>);
    const beerItems = screen.getAllByTestId("beer-item");
    expect(beerItems).toHaveLength(2);
  });
  

  it("should render the 'Nothing to see yet' message when the beer list is empty", () => {
    render(<BeerList beerList={[]} emptyMessage={() => <EmptyList />} />);
    const emptyListMessage = screen.getByText("Nothing to see yet.");
    expect(emptyListMessage).toBeDefined();
  });


  it("should render the 'Load More' button when showLoadMore prop is true", () => {
    render(<BeerList beerList={beerList} emptyMessage={() => <EmptyList />} loadMore={{
      isLoading: false,
      onLoadMore: jest.fn(),
      show: true
    }}/>);
    const loadMoreButton = screen.getByText("Load More");
    expect(loadMoreButton).toBeDefined();
  });


  it("should call the loadMore callback when the 'Load More' button is clicked", () => {
    const loadMoreMock = jest.fn();
    render(<BeerList beerList={beerList} emptyMessage={() => <EmptyList />} loadMore={{
      isLoading: false,
      onLoadMore: loadMoreMock,
      show: true
    }}/>);
    const loadMoreButton = screen.getByText("Load More");
    fireEvent.click(loadMoreButton);
    expect(loadMoreMock).toHaveBeenCalled();
  });


  it("should call the addBeerCallback when the 'Click here' link is clicked", () => {
    const addBeerCallbackMock = jest.fn();
    render(<BeerList beerList={[]} emptyMessage={() => (
      <EmptyList>
        <span
          className="text-primary custom-pointer"
          onClick={addBeerCallbackMock}
        >
          Click here
        </span>{" "}
        to add your first beer!{" "}
      </EmptyList>
    )} />);
    const addBeerLink = screen.getByText("Click here");
    fireEvent.click(addBeerLink);
    expect(addBeerCallbackMock).toHaveBeenCalled();
  });


  it("should not render the 'Load More' button when showLoadMore prop is false", () => {
    render(<BeerList beerList={beerList} emptyMessage={() => <EmptyList />} loadMore={{
      isLoading: false,
      onLoadMore: jest.fn(),
      show: false
    }}/>);
    const loadMoreButton = screen.queryByText("Load More");
    expect(loadMoreButton).toBe(null);
  });


  it("should render the 'Load More' button when showLoadMore prop is true", () => {
    render(<BeerList beerList={beerList} emptyMessage={() => <EmptyList />} loadMore={{
      isLoading: false,
      onLoadMore: jest.fn(),
      show: true
    }} />);
    const loadMoreButton = screen.queryByText("Load More");
    expect(loadMoreButton).toBeDefined();
  });


  it("should render the beer items with correct data", () => {
    render(<BeerList beerList={beerList} emptyMessage={() => <EmptyList />} />);
    const beerName1 = screen.getByText("Beer 1");
    const beerName2 = screen.getByText("Beer 2");
    expect(beerName1).toBeDefined();
    expect(beerName2).toBeDefined();
  });
});