import React from 'react';

import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_, i) => {
           return  <BurgerIngredient key={igKey + i } type={igKey}/>
        }); 
    })
 
    //https://www.udemy.com/react-the-complete-guide-incl-redux/learn/lecture/8109018#questions/3501504
    // Object.keys(props.ingredients) is [salad, bacon, cheese, meat]. 
    //props.ingredients[igKey] is the number of the current ingredient (singular).
    //So 5 slices of cheese is 5. 
    //...Array(props.ingredients[igKey]) is 5 undefined array items, 
    //
    //The ... (spread operator) has stripped them (5 undefineds) out of Array(). 
    //[...Array(props.ingredients[igKey])] 
    //Now,  the 5 undefined array items,  are inside a new array.
    // SO.. obtengo los key, los recorro y por cada uno genero un nuevo array con N posiciones vacias, lo recorro y ahí instancio mi Burgeringredient.
    .reduce( (arr,el) => {
        return arr.concat(el)
    },[]);
    // se usa el reduce para transformar un array en otra cosa. recive previous value y current value.
    if (transformedIngredients.length === 0 ) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    // console.log(transformedIngredients)
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
    </div>
    );
};

export default burger;