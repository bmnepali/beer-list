import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { IMyBeer } from "../interfaces/Beer.interface";
import BeerListPage from "../pages/BeerListPage";
import { generateUUID } from "../utils";
import { StorageUtils } from "../utils/storage";

jest.setTimeout(5000);
jest.mock("../utils/storage");

jest.mock('../utils/index', () => ({
  generateUUID: jest.fn(() => "some-unique-uuid")
}));

describe("BeerListPage", () => {
  const mockedStorageUtils = StorageUtils.getInstance as jest.MockedFunction<
    typeof StorageUtils.getInstance
  >;

  beforeEach(() => {
    mockedStorageUtils.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render the tabs and 'Add New Beer' button", () => {
    render(<BeerListPage />);
    const allBeersTab = screen.getByText("All Beers");
    const myBeersTab = screen.getByText("My Beers");
    const addNewBeerButton = screen.queryByText("Add New Beer");
    expect(allBeersTab).toBeDefined();
    expect(myBeersTab).toBeDefined();
    expect(addNewBeerButton).toBe(null);
  });

  it("should fetch all beers and render them when 'All Beers' tab is selected", async () => {
    const mockResponse = [
      { id: 1, name: "Beer 1", tagline: "Tagline 1", description: "Description 1" },
      { id: 2, name: "Beer 2", tagline: "Tagline 2", description: "Description 2" }
    ];
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    } as any);

    render(<BeerListPage />);
    const allBeersTab = screen.getByText("All Beers");
    fireEvent.click(allBeersTab);

    await waitFor(() => {
      const beerItems = screen.getAllByTestId("beer-item");
      expect(beerItems).toHaveLength(2);
    });
  });

  it("should fetch my beers and render them when 'My Beers' tab is selected", async () => {
    const mockResponse = {
      records: [
        { id: 1, name: "My Beer 1", tagline: "My Tagline 1", description: "My Description 1" },
        { id: 2, name: "My Beer 2", tagline: "My Tagline 2", description: "My Description 2" }
      ],
      totalCount: 2
    };
    const mockedGetPaginatedRecords = jest.fn().mockResolvedValue(mockResponse);
    mockedStorageUtils.mockImplementation(() => ({
      getPaginatedRecords: mockedGetPaginatedRecords
    }) as any);

    render(<BeerListPage />);
    const myBeersTab = screen.getByText("My Beers");
    fireEvent.click(myBeersTab);

    await waitFor(() => {
      const beerItems = screen.getAllByTestId("beer-item");
      expect(beerItems).toHaveLength(2);
    });
  });

  it("should show the 'Nothing to see yet' message when 'My Beers' tab is selected and there are no beers", async () => {
    const mockResponse = {
      records: [],
      totalCount: 0
    };
    const mockedGetPaginatedRecords = jest.fn().mockResolvedValue(mockResponse)

    mockedStorageUtils.mockImplementation(() => ({
      getPaginatedRecords: mockedGetPaginatedRecords
    }) as any);

    render(<BeerListPage />);
    const myBeersTab = screen.getByText("My Beers");

    act(() => {
      fireEvent.click(myBeersTab);
    });

    await waitFor(() => {
      const emptyListMessage = screen.getByText("Nothing to see yet.");
      expect(emptyListMessage).toBeDefined();
    });
  });

  it("should open the 'AddBeerModal' when 'Add New Beer' button is clicked", async () => {
    const mockResponse = {
      records: [],
      totalCount: 0
    };
    const mockedGetPaginatedRecords = jest.fn().mockResolvedValue(mockResponse)

    mockedStorageUtils.mockImplementation(() => ({
      getPaginatedRecords: mockedGetPaginatedRecords
    }) as any);

    render(<BeerListPage />);
    const myBeersTab = screen.getByText("My Beers");

    act(() => {
      fireEvent.click(myBeersTab);
    });

    act(() => {
      const addNewBeerButton = screen.getByText("Add New Beer");
      fireEvent.click(addNewBeerButton);
    });

    await waitFor(() => {
      const modalTitle = screen.getByText("Add New Beer", {selector: 'h5'});
      expect(modalTitle).toBeDefined();
    })
  });

  it("should load more beers when 'Load More' button is clicked", async () => {
    const mockResponse = [
      { id: 1, name: "Beer 1", tagline: "Tagline 1", description: "Description 1" },
      { id: 2, name: "Beer 2", tagline: "Tagline 2", description: "Description 2" }
    ];
    const mockedGetPaginatedRecords = jest.fn().mockResolvedValue({
      records: mockResponse,
      totalCount: 2
    });
    mockedStorageUtils.mockImplementation(() => ({
      getPaginatedRecords: mockedGetPaginatedRecords
    }) as any);

    render(<BeerListPage />);
    const allBeersTab = screen.getByText("All Beers");

    act(() => {
      fireEvent.click(allBeersTab);
    });

    await waitFor(() => {
      const beerItems = screen.getAllByTestId("beer-item");
      expect(beerItems).toHaveLength(10);
    });

    const loadMoreButton = screen.getByText("Load More");

    act(() => {
      fireEvent.click(loadMoreButton);
    });

    await waitFor(() => {
      const beerItems = screen.getAllByTestId("beer-item");
      expect(beerItems).toHaveLength(20);
    });
  });

  it("should save a beer when 'AddBeerModal' is submitted", async () => {
    const beer: IMyBeer = {
      id: generateUUID(),
      name: "Beer 1",
      genere: "Genere 1",
      image_url: "/assets/houzz-beer.png",
      description: "Description 1",
      ingredients: "one, two, three",
    };
    const storageMockResponse = {
      records: [],
      totalCount: 0
    };
    const mockedGetPaginatedRecords = jest.fn().mockResolvedValue(storageMockResponse)
    const mockedAddRecord = jest.fn();

    mockedStorageUtils.mockImplementation(() => ({
      addRecord: mockedAddRecord,
      getPaginatedRecords: mockedGetPaginatedRecords
    }) as any);

    const mockResponse = [
      { id: 1, name: "Beer 1", tagline: "Tagline 1", description: "Description 1" },
      { id: 2, name: "Beer 2", tagline: "Tagline 2", description: "Description 2" }
    ];

    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    } as any);

    render(<BeerListPage />);
    const MyBeersTab = screen.getByText("My Beers");

    act(() => {
      fireEvent.click(MyBeersTab);
    });

    let addNewBeerButton: any = null;
    await waitFor(() => {
      addNewBeerButton = screen.getByText("Add New Beer");
      expect(addNewBeerButton).toBeDefined();
    })
    
    act(() => {
      fireEvent.click(addNewBeerButton);
    });

    const nameInput = screen.getByPlaceholderText("Name");
    const taglineInput = screen.getByPlaceholderText("Genere");
    const descriptionInput = screen.getByPlaceholderText("Description"); 
    const ingredientsInput = screen.getByPlaceholderText("Ingredients"); 
    const submitButton = screen.getByText("Add Beer");

    fireEvent.change(nameInput, { target: { value: beer.name } });
    fireEvent.change(taglineInput, { target: { value: beer.genere } });
    fireEvent.change(descriptionInput, { target: { value: beer.description } });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      // Testing validation
      const invalidIngredients = screen.getByText("Beer ingredients are required");
      expect(invalidIngredients).toBeDefined()  
    })
   
    fireEvent.change(ingredientsInput, { target: { value: beer.ingredients } });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedAddRecord).toHaveBeenCalledTimes(1);
      expect(mockedAddRecord).toHaveBeenCalledWith(beer);
    });
  });
});