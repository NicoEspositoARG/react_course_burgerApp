import React, { Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux'

const withErrorHandler = (WrappedComponent, axios ) => {
    return class extends Component {
        state = {
            error: null

        }
        componentWillMount () { // se podría usar en el constructor, si se deja en el Didmount no funciona
            //en el didMount del WrappedComponent ej: el GET en burgerBuilder
            //guarda los interceptos en props para poder usar el willUnmount, porque al generar instancias
            //de esta clase, se estaban agregando interceptors al obj axios. class 212
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error:null});
                return req
            })
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error:error});
            })
        }
        errorConfirmedHandler = () => {
            this.setState({error:null})
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.response.eject(this.resInterceptor)

        }
    
        render () {
            return (
                <Aux>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message: null}
                    </Modal>
                <WrappedComponent {...this.props} />
                </Aux>
            )
        }
    } 
}

export default withErrorHandler;