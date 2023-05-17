import React from "react";
import TextTruncate from "react-text-truncate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Beer, { IAllBeer, IMyBeer } from "../interfaces/Beer.interface";

interface BeerItemProps {
  beer: IMyBeer | IAllBeer;
}

const BeerItem: React.FC<BeerItemProps> = ({ beer }) => {
  /**
   * Gets the list of ingredients of given Beer
   * @param beer Beer
   * @returns string
   */
  const getBeerIngreidents = (beer: Beer): string => {
    if (beer.ingredients && typeof beer.ingredients === 'object') {
      return Object.keys(beer.ingredients).join(", ");
    }
    return beer.ingredients || "N/A";
  };

  return (
    <div className="beer-item beer-item-hover" data-testid="beer-item">
      <div className="row align-items-center">
        <div className="col-lg-2 col-md-3 text-center">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${beer.id}`} role="tooltip">
                Ingredients: {getBeerIngreidents(beer)}
              </Tooltip>
            }
          >
            <img
              src={beer.image_url || "/assets/houzz-beer.png"}
              alt={beer.name}
              data-testid="beer-image"
              className="img-fluid"
            />
          </OverlayTrigger>
        </div>
        <div className="col-lg-10 col-md-9">
          <div className="beer-details">
            <h4 className="title overflow-text">
              {beer.name}
            </h4>
            <div className="tagline mb-2 overflow-text">
              {(beer as IAllBeer).tagline || (beer as IMyBeer).genere || ''}
            </div>
            <div className="description">
              <TextTruncate
                line={2}
                element="span"
                truncateText="…"
                text={beer.description}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeerItem;
