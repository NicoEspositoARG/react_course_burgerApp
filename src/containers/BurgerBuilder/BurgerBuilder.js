import React, { Component } from "react";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner"

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false,
    purchasing:false,
    loading: false

  };

  updatePurchaseState (ingredients) {
 
    const sum = Object.keys(ingredients) // creates an array of strings
      .map(igKey => {
        return ingredients[igKey];// un array con nros, la Q de cada ingredient
      })
      .reduce((sum, el) => { // empieza desde el element 0, y para cada uno hace sum+el y acumula.
        return sum + el},0);
      
      this.setState({purchasable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount +1;
    const updatedIngredients = { ...this.state.ingredients };
      
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients})
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount -1;
    const updatedIngredients = { ...this.state.ingredients };
      
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients})
    this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler = () => {
    this.setState({purchasing:true})
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false})
  }

  purchaseContinueHandler = () => {
    this.setState({ loading: true });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Nico Esposito',
        address: {
          street: "Test Street 1",
          zipCode: "41531",
          country: "Uruguay"
          },
        email: "test@test.com",  
        },
        deliveryMethod: "cheapest"
    }
    axios.post('/orders.json', order)
    .then(
      response => { 
        this.setState({ loading:false, purchasing:false })        
      })
    .catch(error => {
      this.setState({ loading:false, purchasing:false })        
      console.log(error)
    })
  }

  render() {
      const disabledInfo = {
        ...this.state.ingredients
      };
      for (let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
      }
      // {salad:true, meat:false, ..}
      let orderSummary = <OrderSummary
      price={this.state.totalPrice}
      ingredients={this.state.ingredients}
      purchaseCancelled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}
    />

      if (this.state.loading) {
        orderSummary = <Spinner />
      }
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>

        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingridientAdded={this.addIngredientHandler}
          ingridientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
