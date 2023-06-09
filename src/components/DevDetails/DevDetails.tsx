import type { DevInfos } from "../../types";
import { CircularProgress, Rating } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../contexts/authContext";
import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import PrestationCard from "../DevProfile/PrestationCard";
import OrderModal from "./OrderModal";
import "./style.scss";

function DevDetails() {
  //HOOKS
  const { devID } = useParams();
  const { auth } = useContext(authContext);

  //STATES
  const [dev, setDev] = useState<DevInfos>();
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [services, setServices] = useState<Boolean>(false);

  //MODAL STATES
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    (async () => {
      await fetch(`${import.meta.env.VITE_API_URL}/developer/${devID}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDev(data[0]);
          setIsLoaded(true);
        })
        .catch((error) => console.error(error));
    })();
  }, [isLoaded, services, devID]);

  if (dev) {
    let average: number | null = 0;
    if (dev.reviews) {
      dev.reviews.length > 0
        ? (average =
          dev.reviews.reduce((a, b) => a + b.rating, 0) / dev.reviews.length)
        : (average = null);
    }
    return (
      <>
        <OrderModal
          open={open}
          onClose={handleClose}
          orders={setServices}
          developerId={devID}
          devData={dev}
        />
        <div className="profile__container">
          <div className="profile__left-part">
            <div className="detail__situation">
              <h3>En quelques mots : </h3>
              <ul>
                <li>
                  <span>Inscrit depuis le :</span> {dev.registered_at}
                </li>
                <li>
                  <span>Situation :</span> Disponible actuellement
                </li>
                <li>
                  <span>Missions réalisées :</span>{" "}
                  {dev.orders_count != null ? dev.orders_count : "Aucune"}{" "}
                </li>
                <li>
                  <span>Dernière mission :</span>{" "}
                  {dev.last_order_date != null ? dev.last_order_date : "Aucune"}
                </li>
              </ul>
            </div>
            <div className="stacks__section__container">
              <div className="header__stack">
                <p>Compétences maîtrisées :</p>
              </div>
              <div className="dev__stacks">
                {dev.stacks.map((stack) => {
                  return (
                    <div key={stack.id} className="stack__item">
                      <img src={stack.logo} alt={`Logo ${stack.name}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="profile__right-part">
            <div className="dev__info">
              <div className="img__container">
                <img
                  src={dev.avatar}
                  alt={`${dev.firstname} ${dev.lastname} avatar`}
                />
              </div>
              <div className="dev__name-job">
                <h3>
                  {dev.firstname} {dev.lastname}
                </h3>
                <p>Développeur depuis {dev.years_of_experience} ans</p>
              </div>
              {average != null ? (
                <div className="dev__rating">
                  <p>{average}</p>
                  <Rating
                    name="half-rating-read"
                    size="large"
                    value={average}
                    precision={0.5}
                    readOnly
                  />
                  <p className="count__rating">({dev.reviews.length})</p>
                </div>
              ) : (
                <div className="dev__rating">
                  <p>Aucune note</p>
                  <Rating
                    name="half-rating-read"
                    size="large"
                    value={0}
                    precision={0.5}
                    readOnly
                  />
                </div>
              )}
              { auth.access_token != undefined &&
                auth.user_info.user_role === "0" ? (
                <div className="dev__contact">
                  <Button onClick={handleOpen}>Demandez une prestation</Button>
                </div>
              ) : (
                ""
              )}
              <div className="dev__prestations-reviews">
                <h3>
                  {dev.prestations.length > 1
                    ? "Services proposés "
                    : "Service proposé "}
                  :
                </h3>
                <div className="dev__prestations-container">
                  {dev.prestations &&
                    dev.prestations.map((prestation) => (
                      <PrestationCard
                        key={prestation.id}
                        prestation={prestation}
                        services={services}
                        setServices={setServices}
                        devProfileId={dev?.id}
                        displayButton={false}
                      />
                    ))}
                </div>
                <h3>
                  {dev.reviews.length > 1
                    ? "Notes et commentaires reçues "
                    : "Note reçue "}
                  :
                </h3>
                <div className="dev__reviews-container">
                  {dev.reviews &&
                    dev.reviews.map((review) => {
                      return (
                        <div key={review.id} className="dev__review-item">
                          <p className="author__review">{review.user_who_reviewed}</p>
                          <div className="rating__and__service">
                            <Rating
                              className="rating__star"
                              name="half-rating-read"
                              value={review.rating}
                              precision={0.5}
                              readOnly
                            />
                            <p className="service__review">ERP</p>
                          </div>
                          <p className="comment__review">{review.comment}</p>
                          <p className="date__review">Posté le {review.created_at}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <CircularProgress className="loader" />;
  }
}

export default DevDetails;
