import React, { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BeerList from "../compponents/BeerList";
import AddBeerModal from "../compponents/AddBeerModal";
import { StorageUtils } from "../utils/storage";
import { IAllBeer, IMyBeer, IMyBeers } from "../interfaces/Beer.interface";
import Loader from "../compponents/Loader";
import EmptyList from "../compponents/EmptyList";

const MY_BEERS = 'My Beers';
const ALL_BEERS = 'All Beers';

const BeerListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [currentTab, setCurrentTab] = useState(ALL_BEERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allBeers, setAllBeers] = useState<IAllBeer[]>([]);
  const [myBeers, setMyBeers] = useState<IMyBeers>({
    records: [],
    totalCount: 0
  });

  const tabs = [
    { id: 1, label: ALL_BEERS },
    { id: 2, label: MY_BEERS }
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Get all the Beers from https://api.punkapi.com/v2
   * @param pageNumber
   * @returns Promise<Response>
   */
  const getAllBeers = async (page: number): Promise<Response> => {
    const response: Response = await fetch(
      `https://api.punkapi.com/v2/beers?page=${page}&per_page=10`
    );
    return response;
  };

  /**
   * Save the given Beer info in localStorage
   * @param beer IMyBeer
   */
  const saveMyBeer = async (beer: IMyBeer) => {
    const storageUtils = StorageUtils.getInstance<IMyBeer>("recordList");
    storageUtils.addRecord(beer);
    setMyBeers((prevBeers) => ({
      records: [...prevBeers.records, beer],
      totalCount: prevBeers.totalCount + 1
    }));
    toast("Beer saved successfully!", { position: "bottom-center" });
    closeModal();
  };

  /**
   * Get list of records of type (IMyBeer) saved in LocalStorage
   * @param page Number
   * @returns Promise<IMyBeers>
   */
  const getMyBeers = async (page: number): Promise<IMyBeers> => {
    const storageUtils = StorageUtils.getInstance<IMyBeer>("recordList");
    return storageUtils.getPaginatedRecords(page, 10);
  };

  /**
   * Fetch Beer list based on given list type
   * @param listType
   */
  const fetchBeers = async (listType: string) => {
    try {
      setLoading(true);
      if (listType === ALL_BEERS) {
        const response = await getAllBeers(page);
        const responseData = await response.json();
        setAllBeers((prevBeers) => [...prevBeers, ...responseData]);
      } else {
        const { records, totalCount } = await getMyBeers(page);
        setMyBeers((prevBeers) => ({
          records: [...prevBeers.records, ...records],
          totalCount: prevBeers.totalCount + totalCount
        }));
      }

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      toast("Error fetching beers:", {
        position: "bottom-center",
        type: "error"
      });
      console.log("Error fetching beers:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more beers
   */
  const loadMoreBeers = async () => {
    try {
      let responseData: IAllBeer[] = [];
      setLoadingMore(true);
      if (currentTab === ALL_BEERS) {
        const response = await getAllBeers(page);
        responseData = await response.json();
        setAllBeers((prevBeers) => [...prevBeers, ...responseData]);
      } else {
        const { records, totalCount } = await getMyBeers(page);
        setMyBeers((prevBeers) => ({
          records: [...prevBeers.records, ...records],
          totalCount: prevBeers.totalCount + totalCount
        }));
      }
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      toast("Error loading more beers:", {
        position: "bottom-center",
        type: "error"
      });
      console.log("Error fetching beers:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Check if load more button is to be shown or not.
   * @returns Boolean
   */
  const showLoadMoreBtn = () => {
    return currentTab === ALL_BEERS
      ? allBeers.length > 0
      : myBeers.totalCount > 10 * page
  }

  /**
   * Generates the Empty list view
   * @returns ReactNode
   */
  const getEmptyMessage = (): ReactNode => {
    if (currentTab === MY_BEERS) {
      return (
        <EmptyList>
          <span
            className="text-primary custom-pointer"
            onClick={openModal}
          >
            Click here
          </span>{" "}
          to add your first beer!{" "}
        </EmptyList>
      )
    }
    return (<EmptyList />)
  }

  useEffect(() => {
    fetchBeers(currentTab);
  }, [currentTab]);

  return (
    <div className="container">
      <div className="mt-5 mb-4 tabs-wrapper">
        <ul className="custom-tabs">
          {tabs.map((tab) => (
            <li
              className={`custom-tabs-item ${
                currentTab === tab.label ? "active" : ""
              }`}
              key={tab.id}
            >
              <label
                className="custom-tabs-link"
                onClick={() => {
                  setCurrentTab(tab.label);
                  setPage(1);
                  setAllBeers([]);
                  setMyBeers({ records: [], totalCount: 0 });
                }}
              >
                {tab.label}
              </label>
            </li>
          ))}
        </ul>
        {currentTab === MY_BEERS ? (
          <button className="btn btn-primary me-2" onClick={openModal}>
            Add New Beer
          </button>
        ) : null}
      </div>
      <div className="container">
        {isLoading ? (<Loader />) : (
          <BeerList
            loadMore={{
              isLoading: isLoadingMore,
              show: showLoadMoreBtn(),
              onLoadMore: loadMoreBeers
            }}
            emptyMessage={getEmptyMessage}
            beerList={currentTab === ALL_BEERS ? allBeers : myBeers.records}
          />
        )}
      </div>
      {isModalOpen && (
        <AddBeerModal handleSubmit={saveMyBeer} closeModal={closeModal} />
      )}
    </div>
  );
};

export default BeerListPage;
