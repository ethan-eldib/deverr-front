import Card from "../Card/Card";
import { useEffect, useState } from "react";
import { Dev, HomepageDev } from "../../types";
import './style.scss'

function CardList() {

  const [devList, setDevList] = useState<HomepageDev[]>();
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);

  //const [userList, setUserList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-dev.deverr.fr/random-users', {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
            "Content-type": "application/json"
          },
          mode: 'cors'
        });
        const data = await response.json();
        setDevList(data);
        console.log(data)
        setIsLoaded(true);
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [])
  
  return (
    <>
      {isLoaded && (
        <div className="cards__container">
          {devList && devList.map((dev) => {
            return <Card key={dev.id} {...dev} />
          })
          }
        </div>
      )}
    </>
  )
}

export default CardList