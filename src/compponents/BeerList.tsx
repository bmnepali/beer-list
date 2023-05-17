import React, { ReactNode } from "react";
import { FaAngleDown } from "react-icons/fa";
import {IAllBeer, IMyBeer} from "../interfaces/Beer.interface";
import BeerItem from "./BeerItem";

interface BeerListProps {
  beerList: IAllBeer[] | IMyBeer[];
  loadMore?: {
    show: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
  };
  emptyMessage: () => ReactNode;
}

const BeerList: React.FC<BeerListProps> = ({
  beerList,
  loadMore,
  emptyMessage
}) => {
  return (
    <>
      <div className="row pb-5">
        {beerList.map((beer, index) => (
          <div
            key={`${beer?.id}-${index}`}
            className="col-md-12 col-lg-6 mb-4"
          >
            <BeerItem beer={beer} />
          </div>
        ))}
        {!beerList.length ? <div>{emptyMessage()}</div> : null}

        {loadMore?.show ? (
          <div className="text-center  mt-2 mb-3">
            <div className="text-primary load-more" onClick={loadMore.onLoadMore}>
              {loadMore?.isLoading ? (
                <div className="spinner-border text-primary spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : <>Load More <FaAngleDown /></>}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default BeerList;
