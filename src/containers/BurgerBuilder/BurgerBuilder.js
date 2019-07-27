import React, { Component } from "react";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

import Spinner from "../../components/UI/Spinner/Spinner"
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import { connect } from "react-redux";
import * as actions from "../../store/actions/index"

import axios from "../../axios-orders";




class BurgerBuilder extends Component {
  state = {

    // ingredients:null,
    // totalPrice: 4,
    //local UI state:
    // purchasable: false,
    purchasing:false,
   
    //
  };

  componentDidMount() {
    this.props.onInitIngredients();    
  }

  updatePurchaseState (ingredients) {
 
    const sum = Object.keys(ingredients) // creates an array of strings
      .map(igKey => {
        return ingredients[igKey];// un array con nros, la Q de cada ingredient
      })
      .reduce((sum, el) => { // empieza desde el element 0, y para cada uno hace sum+el y acumula.
        return sum + el},0);
      
      return sum > 0
  }

  // addIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount +1;
  //   const updatedIngredients = { ...this.state.ingredients };
      
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients})
  //   this.updatePurchaseState(updatedIngredients)
  // }

  // removeIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount -1;
  //   const updatedIngredients = { ...this.state.ingredients };
      
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceAddition;
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients})
  //   this.updatePurchaseState(updatedIngredients)
  // }

  purchaseHandler = () => {
    this.setState({purchasing:true})
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false})
  }

  purchaseContinueHandler = () => {

    this.props.onInitPurchase();
    this.props.history.push({ pathname: '/checkout'})
  }

  render() {
      const disabledInfo = {
        ...this.props.ings
      };
      for (let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
      }
      // {salad:true, meat:false, ..}
      let orderSummary = null;
    
      let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>

      if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingridientAdded={ this.props.onIngredientAdded }
            ingridientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
          />
        </Aux>)
      orderSummary = (
      <OrderSummary
        price={this.props.price}
        ingredients={this.props.ings}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    );  
    // if (this.state.loading) {
    //   orderSummary = <Spinner />
    // }
    
    };
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
          inProgress={this.state.loading}
        >
          {orderSummary}
        </Modal>
        {burger}
        
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch( actions.addIngredient(ingName)),

    onIngredientRemoved: ingName => dispatch( actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit())

    };
};

export default connect(mapStateToProps,mapDispatchToProps)( withErrorHandler( BurgerBuilder, axios));
