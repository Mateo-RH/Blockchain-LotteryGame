import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import { Router } from '../../routes';

class LotteryNew extends Component {
  state = {
    contribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      // FIXME: Se permiten hacer loterias de 0 wei (input vacio)
      await factory.methods.createLottery(this.state.contribution).send({
        from: accounts[0]
      });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create Lottery</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.contribution}
              onChange={event =>
                this.setState({ contribution: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            loading={this.state.loading}
            disabled={this.state.loading}
            primary
          >
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default LotteryNew;
