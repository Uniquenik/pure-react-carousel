import React from 'react';
import {SliderCard} from "./shared/slider-card";
import Slider from "./components/slider";
import {cardsInfo} from "./shared/data";


function App() {
  return (
      <>
        {cardsInfo &&
            <Slider
                title={'Актуальное'}
                infiniteLoop={true}>
              {cardsInfo.map((el) => {
                return (
                    <SliderCard
                        key={el.id}
                        id={el.id}
                        title={el.title}
                        description={el.text}
                        date={el.date}/>
                )
              })}
            </Slider>
        }
    </>
  );
}

export default App;
