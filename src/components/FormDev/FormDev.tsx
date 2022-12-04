import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DevInput from '../../models/devInput';
import Stacks from "../../models/stacks";
import { Link } from 'react-router-dom';
import './formDev.scss';

const defaultValues = {
  firstname: "",
  lastname: "",
  email: "",
  stacks: [{
    id: 0,
    name: "",
    experience: 0,
    is_primary: false,
  }],
  years_of_experience: 1,
  description: "",
  password: "",
  confirmedPassword: "",
  type: "developer",
};

const FormDev = () => {
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stacks, setStacks] = useState<Stacks[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [filteredStacks, setFilteredStacks] = useState<Stacks[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<Stacks[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DevInput>({ defaultValues });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-dev.deverr.fr/stacks/all', {
          method: "GET",
          headers: {
            //TODO find a better way to allow access to cors
            "access-control-allow-origin": "*",
            "Content-type": "application/json",
          },
          mode: 'cors'
        });
        const data = await response.json();
        setStacks(data);
        setIsLoaded(true);
        setSuccessMessage(data.message);
        setTimeout(() => {setSuccessMessage("")}, 4000);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData()
  }, [isLoaded]);

  // We update the state every time there is a change in techno
  useEffect(() => {
    setSelectedStacks(selectedStacks);
  }, [selectedStacks]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length) {
      let filterStack = stacks.filter(stack => stack.name.toLowerCase().includes(event.target.value));
      setFilteredStacks(filterStack);
    } else {
      setFilteredStacks([]);
    }
  }

  const onSubmit: SubmitHandler<DevInput> = async (data) => {
    setLoading(true);
    try {
      await fetch('https://api-dev.deverr.fr/register', {
        method: "POST",
        headers: {
          //TODO find a better way to allow access to cors
          "access-control-allow-origin": "*",
          "Content-type": "application/json",
        },
        mode: 'cors',
        body: JSON.stringify(data),
      });
      reset();
      setLoading(false);
      setSelectedStacks([]);
    } catch (e) {
      console.log(e);
    }
  };

  const onSelectedStacks = (stack: Stacks) => {
    // We will look for the techno selected in the initial table (which is stacks)
    const selectedStack = stacks.find(stackFind => stackFind.name === stack.name);
    if (selectedStack) {
      // In the setSelectedStacks, we take the old values (current) then
      // we send them to a new array which is [...current, selectedStack]
      setSelectedStacks(current => {
        return [...current, selectedStack]
      });
    }
  };

  const onDeletedStacks = (stack: Stacks) => {
    setSelectedStacks(selectedStacks.filter(selectedStack => selectedStack !== stack));
  };

  return (
    <section className="register__form__dev">
      <h1>Inscription d'un développeur</h1>
      <div className="succes">
        <p>{successMessage}</p>
      </div>

      <div className="load">
        <p>{loading ? "Chargement..." : ""}</p>
      </div>

      <form className="dev__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input__container">
          <p className="error">{errors.lastname?.message}</p>
          <label>Nom</label>
          <input type="text" {...register("lastname")} placeholder="Nom" />

          <p className="error">{errors.firstname?.message}</p>
          <label>Prénom</label>
          <input type="text" {...register("firstname")} placeholder="Prénom" />

          <p className="error">{errors.email?.message}</p>
          <label>Email</label>
          <input type="email" {...register("email")} placeholder="E-mail" />

          <div className="stacks__container">
            <p className="error">{errors.stacks?.message}</p>
            <label>Vos compétences</label>
            <div className="stack__container">
              <div className="stack__input">
                <input type="text" placeholder="Ajoutez les compétences que vous maîtrisez." onChange={handleChange} />
              </div>
              {
                filteredStacks.length > 0 &&
                <div className="stack__list">
                  <ul>
                    {
                      filteredStacks.map(stack => {
                        if (selectedStacks.find(selectedStack => selectedStack.name === stack.name)) {
                          return null;
                        } else {
                          return <li key={stack.id} value={stack.name} onClick={() => onSelectedStacks(stack)}>{stack.name}</li>
                        }
                      })
                    }
                  </ul>
                </div>
              }
              <div className="stack__list">
                <ul>
                  {
                    selectedStacks.map(stack => {
                      return <li className="selectedStack" key={stack.id}>{stack.name} <CloseIcon onClick={() => onDeletedStacks(stack)} /> </li>
                    })
                  }
                </ul>
              </div>
            </div>
          </div>

          <p className="error">{errors.years_of_experience?.message}</p>
          <label>Années d'expérience</label>
          <input className="experience" type="number" {...register("years_of_experience")} min="1" max="10" />

          <p className="error">{errors.description?.message}</p>
          <label className="label__description">Description</label>
          <textarea className="description" {...register("description")} placeholder="Description" />

          <p className="error">{errors.password?.message}</p>
          <label>Mot de passe</label>
          <input type="password" {...register("password")} placeholder="Mot de passe" />

          <p className="error">{errors.confirmedPassword?.message}</p>
          <label>Confirmer le mot de passe</label>
          <input type="password" {...register("confirmedPassword")} placeholder="Confirmez votre mot de passe" />
        </div>

        <div className="button__container">
          <Link to="/registerclient">
            <p>Je suis un client</p>
          </Link>
          <button type="submit" className="btn">
            <span className="span">Envoyer</span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormDev